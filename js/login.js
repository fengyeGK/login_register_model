/**
 * Created by Administrator on 2016/1/28.
 * author： wen yang
 */
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
                        url: 'index.php?act=index&op=login',//这里是提交到后台的一个路由地址，类似这样的是执行后台里控制器index下的login方法来处理登录提交
                        type: 'post',
                        dataType: 'json',
                        data: {
                            phone: $('#phone').val(),
                            password: $('#password').val()
                        },
                        success: function(data) {//后台返回的json如{key:1,keyMain:'登录成功'}
                            if (data.key) { //登录成功
                                //这里写登录成功后的代码逻辑
                                console.log(data);
                                alert(data.keyMain);
                            } else {//登录失败 后台返回的json如{key:0, keyMain:'登录失败'}
                                //这里写登录失败后的代码逻辑
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
                            url: 'index.php?act=index&op=verifyPhone', //验证码后台处理程序,异步验证手机号是否存在
                            type: "post", //数据发送方式
                            dataType: "json", //接受数据格式
                            data: { //要提交到后台的数据  后台成功则返回字符串如"true",失败则返回字符串如'false'
                                phone: function() {
                                    return $("#phone").val();
                                }
                            }
                        }
                    },
                    password: {
                        required: true,
                        minlength: 6
                    }
                },
                messages: { //配置提示信息
                    phone: {
                        required: "请输入手机号",
                        vPhone: "输入的手机格式不正确",
                        remote: "手机号码不存在"
                    },
                    password: {
                        required: "请输入密码",
                        minlength: $.validator.format("密码不能小于{0}个字符")
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


    myValidate.init('#loginForm');//初始化登录验证

});