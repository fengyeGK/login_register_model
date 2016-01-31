几乎我们接触到的项目都会有登录和注册，而且逻辑也基本没变，就是样式展示不同而已，为了方便以后在做项目时，快速搭建起前端的登录和注册页，以及逻辑校验的编写
所以记录如下，方便今后引用。

## 首先我们建立好一个目录结构

- login_register_model
    - login.html
    - register.html
    - js
        - login.js
        - register.js

>以上结构我并没有创建样式目录，因为此模板我们不需要样式，因为每个项目的样式是不一样的，所以样式在此不做添加，这里只有骨架html和行为js

## 接着我们来安装依赖项

即待会用到的登录注册校验是依赖jquery.validation.js的，而这个jquery.validation.js又是依赖于jQuery的，所以我们先来安装这两个脚本到项目里

采用bower安装：（这里假设你已经安装了包bower管理了，不会的可以看它的官网）

$ bower install jquery-validation

>以上这个安装会自动也把jquery安装进来，以及bower会去检测你安装的这个js是否有依赖项，刚好jquery.validation.js 是依赖jQuery的，所用这条命令也把jQuery也给你安装了

***为什么要采用这个bower来安装你所需要的资源到你的项目里呢？***

因为每次碰到我们要用到的什么插件，一条命令就能搞定，可以很方便的提高我们的开发效率，而不用去上网找你所需要的资源，而且你想安装什么版本都可以，还帮你把js之间的相互依赖项也给你安装好。

此时你的目录结构会多出一个文件夹及文件夹里边的两个依赖包jquery和jquery-validation，结构如下

- login_register_model
    - bower_components
        - jquery
        - jquery-validation
    - login.html
    - register.html
    - js
        - login.js
        - register.js

***接着就可以在自己的html里边引入你待会写脚本所依赖的js了***

> <script src="bower_components/jquery/dist/jquery.min.js"></script>

> <script src="bower_components/jquery-validation/dist/jquery.validate.min.js"></script>

项目所需要的依赖脚本和骨架html到此为止。

接下来可以动手写你自己的校验逻辑了。

所有文件的内容预览如下：

## 注册模块

注册html代码

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>注册页</title>
    <style>
        .error{
            color: red;
        }
    </style>
</head>
<body>
<form id="regForm">
    <div>
        <label>手机</label>
        <input type="text" name="phone" id="phone" >
        <input type="button" value="获取验证码" id="getCode">
    </div>
    <div>
        <label>手机验证码</label>
        <input type="text" name="phoneCode" id="phoneCode">
    </div>
    <div>
        <label>设置密码</label>
        <input type="password" name="password" id="password" >
    </div>
    <div>
        <label>确认密码</label>
        <input type="password" name="confirmPassword" id="confirmPassword" >
    </div>
    <div>
        <label>验证码</label>
        <input type="text" name="code">
        <!--在下边code-img插入验证码图片-->
        <span id="code-img">验证码图片</span>
    </div>
    <div><input type="checkbox" checked>同意 <a href="#" id="userProtocol">《用户注册协议》</a></div>
    <div>已经注册？ <a href="login.html">马上登录</a></div>
    <div><input type="submit" value="立即注册"></div>
</form>
<h3>注：以上测试输入13512345678手机号会提示这个手机已经注册，测试用的手机验证码为123456</h3>
<script src="bower_components/jquery/dist/jquery.min.js"></script>
<script src="bower_components/jquery-validation/dist/jquery.validate.min.js"></script>
<script src="js/register.js"></script>
</body>
</html>
```

注册校验register.js

```javascript
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
```

***模拟后台处理逻辑的index.php***（这里只是简单的模拟返回数据，好方便测试效验规则，这个文件就直接放在你的根目录login_register_model 下即可），目录结构变成

- login_register_model
    - bower_components
        - jquery
        - jquery-validation
    - login.html
    - register.html
    - js
        - login.js
        - register.js
   - index.php

***index.php***
```
<?php
/**
 * Created by PhpStorm.
 * User: wen yang
 * Date: 2016/1/28
 * Time: 16:28
 */
/*模拟后台返回值*/
/*注册模块处理逻辑*/
$type = $_GET['op'];
if($type =='reg'){//注册提交
    $phoneCode = $_POST['phoneCode'];
    if ($phoneCode === '123456') {//验证码是123456才能注册成功
        echo json_encode(array('key'=>1, 'keyMain'=>'注册成功'));
    }else{
        echo json_encode(array('key'=>0, 'keyMain'=>'注册失败'));
    }
}
if($type =='verifyCode'){//验证手机号是否已被注册
    $phone = $_POST['phone'];
    if($phone === '13512345678'){
        exit('false');
    }else{
        exit('true');
    }
}
if($type =='ajaxSendMobileCode'){//获取手机验证码
    $phone = $_POST['phone'];
    if($phone === '13512345678'){
        echo json_encode(array('key'=>0, 'keyMain'=>'获取验证码失败'));
    }else{
        echo json_encode(array('key'=>1, 'keyMain'=>'获取成功'));
    }
}
```
***到这里，注册的模块基本完成了。接下来是登录模块***

## 登录模块

html 代码

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>login</title>
    <style>
        .error{
            color: red;
        }
    </style>
</head>
<body>
<form id="loginForm">
    <div>
        <label>用户名</label>
        <input type="text" name="phone" id="phone" placeholder="手机号码" >
    </div>
    <div>
        <label>密码</label>
        <input type="password" name="password" id="password" >
    </div>
    <div><input type="submit" value="登录"></div>
</form>
<h3>注：以上测试输入13512345678手机号和密码123456，可登陆成功</h3>
<script src="bower_components/jquery/dist/jquery.min.js"></script>
<script src="bower_components/jquery-validation/dist/jquery.validate.min.js"></script>
<script src="js/login.js"></script>
</body>
</html>
```

***登陆效验login.js***

javascript 代码

```javascript
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
```

***此时模拟后台处理逻辑的index.php 添加入登陆处理逻辑***

php 代码

```
<?php
/**
 * Created by PhpStorm.
 * User: wen yang
 * Date: 2016/1/28
 * Time: 16:28
 */
/*模拟后台返回值*/
/*注册模块处理逻辑*/
$type = $_GET['op'];
if($type =='reg'){//注册提交
    $phoneCode = $_POST['phoneCode'];
    if ($phoneCode === '123456') {//验证码是123456才能注册成功
        echo json_encode(array('key'=>1, 'keyMain'=>'注册成功'));
    }else{
        echo json_encode(array('key'=>0, 'keyMain'=>'注册失败'));
    }
}
if($type =='verifyCode'){//验证手机号是否已被注册
    $phone = $_POST['phone'];
    if($phone === '13512345678'){
        exit('false');
    }else{
        exit('true');
    }
}
if($type =='ajaxSendMobileCode'){//获取手机验证码
    $phone = $_POST['phone'];
    if($phone === '13512345678'){
        echo json_encode(array('key'=>0, 'keyMain'=>'获取验证码失败'));
    }else{
        echo json_encode(array('key'=>1, 'keyMain'=>'获取成功'));
    }
}
//登录模块处理逻辑
if($type =='login'){//登陆提交
    $phone = $_POST['phone'];
    $password = $_POST['password'];
    if ($phone === '13512345678' && $password === '123456') {//手机号跟密码是这个才能登陆成功
        echo json_encode(array('key'=>1, 'keyMain'=>'登陆成功'));
    }else{
        echo json_encode(array('key'=>0, 'keyMain'=>'登陆失败,密码不正确'));
    }
}
if($type =='verifyPhone'){//验证手机号是否存在
    $phone = $_POST['phone'];
    if($phone === '13512345678'){
        exit('true');
    }else{
        exit('false');
    }
}
```
> 至此，以完成了登陆跟注册了，以后碰到要写登陆注册再也不用重复造轮子了，基本大同小亦，写完这些你就可以安心交给后端了，至于那些后端逻辑是怎么处理的，就交给后端完成吧。

以上所有代码我都放到我的github上了，欢迎大家下载<https://github.com/wenyang12/login_register_model>

也可以在下边打开预览效果：

***登陆：*** <http://3.wenphp.sinaapp.com/test/login_register_model/login.html>

***注册：*** <http://3.wenphp.sinaapp.com/test/login_register_model/register.html>