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