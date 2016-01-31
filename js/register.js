/**
 * Created by Administrator on 2016/1/28.
 * author wenyang
 */
$(function() {
    var myValidate = (function($) {
        function ValidFun(id) {
            this.form = $(id);
        }
        ValidFun.prototype.init = function() {
            return this.form.validate({
                submitHandler: function() { //如果验证成功，则提交ajax
                    $.ajax({
                        url: 'index.php?act=index&op=reg',//这里是提交到后台的一个路由地址，类似这样的是执行后台里控制器index下的reg方法来处理注册提交
                        type: 'post',
                        dataType: 'json',
                        data: {
                            phone: $('#phone').val(),
                            phoneCode: $('#phoneCode').val(),
                            password: $('#password').val(),
                            code: $('#code').val()

                        },
                        success: function(data) {//后台返回的json如{key:1,keyMain:'注册成功'}
                            if (data.key) { //注册成功
                                //这里写注册成功后的代码逻辑
                                console.log(data);
                                alert(data.keyMain);
                            } else {//注册失败 后台返回的json如{key:0, keyMain:'注册失败'}
                                //这里写注册失败后的代码逻辑
                                console.log(data);
                                alert(data.keyMain);
                            }
                        }
                    });
                },
                rules: { //配置规则
                    phone: {
                        required: true,
                        vPhone: true,
                        remote: {
                            url: 'index.php?act=index&op=verifyCode', //验证码后台处理程序,异步验证手机号是否已经注册过了
                            type: "post", //数据发送方式
                            dataType: "json", //接受数据格式
                            data: { //要提交到后台的数据  后台成功则返回字符串如"true",失败则返回字符串如'false'
                                phone: function() {
                                    return $("#phone").val();
                                }
                            }
                        }
                    },
                    phoneCode: {
                        required: true
                    },
                    password: {
                        required: true,
                        minlength: 6
                    },
                    confirmPassword: {
                        required: true,
                        minlength: 6,
                        equalTo: "#password"
                    },
                    code: {
                        required: true,
                        minlength:4
                    }
                },
                messages: { //配置提示信息
                    phone: {
                        required: "请输入手机号",
                        vPhone: "输入的手机格式不正确",
                        remote: "手机号码已经注册过"
                    },
                    phoneCode: {
                        required: "请输入手机验证码"
                    },
                    password: {
                        required: "请输入密码",
                        minlength: $.validator.format("密码不能小于{0}个字符")
                    },
                    confirmPassword: {
                        required: "请输入确认密码",
                        minlength: $.validator.format("确认密码不能小于{0}个字符"),
                        equalTo: "两次输入密码不一致"
                    },
                    code: {
                        required: "请输入图形验证码",
                        minlength: $.validator.format("图形验证码不能小于{0}个字符")
                    }
                },
                errorPlacement: function(error, element) {//改变错误提示的位置
                    error.appendTo(element.parent());
                }

            });
        };
        $.validator.addMethod('vPhone', function(value, element, params) {//添加一个手机验证方法
            var patten = /^0?(13|14|15|18)[0-9]{9}$/;
            if (params && patten.test(value)) {
                return true;
            } else {
                return false;
            }
        });
        return {
            init: function(id) {
                var instance = new ValidFun(id);
                return instance.init(); //返回validator的实例
            }
        }
    })($);

    /*获取验证码的模块模式封装*/
    var getCode = (function($){
        function Code(id,validatorInstance) {
            this.elem = $(id);
            this.validatorInstance = validatorInstance;
        }
        Code.prototype.init=function() {
            var $this = this.elem;
            var self = this;
            $this.on('click', function() {
                if(self.validatorInstance.element('input[name=phone]')){//手机号验证通过了才可以发送验证码
                    $.ajax({
                        type: "POST",
                        url: "index.php?act=index&op=ajaxSendMobileCode",
                        data: {
                            phone: $('#phone').val()
                        },
                        dataType: "json",
                        success: function(data) {
                            $this.prop('disabled',true).addClass('disabled');
                            if (data.key) {//成功
                                self.addTipCountDown(120);
                            } else {//失败
                                alert(data.keyMain);
                                $this.prop('disabled',false).removeClass('disabled');
                                return false;
                            }
                        }
                    });
                }
            })
        };
        Code.prototype.addTipCountDown = function(time) {
            var self =this;
            var stop;
            var tipElement = $('<span class="phoneTip">验证码已发送,<span style="color:#fe6700;" class="times">' + time + '</span>秒后可重新获取</span>');
            this.elem.parent().append(tipElement);
            stop = setInterval(function() {
                time = time - 1;
                $(".times").html(time);
                if (time <= 0) {
                    clearInterval(stop);
                    self.elem.prop('disabled',false).removeClass('disabled');
                    tipElement.remove();
                }
            }, 1000);
        };
        return {
            init: function(id,validatorInstance) {
                var instance = new Code(id,validatorInstance);
                instance.init();
            }
        }
    })($);

    var validatorInstance = myValidate.init('#regForm');//初始化注册验证
    getCode.init('#getCode',validatorInstance);//初始化获取验证码
});