<?php
require_once("../scripts/functions.php");

 ?>   
<!DOCTYPE html>
<html lang="en-US" class="js">
<head>  
    <meta charset="utf-8">
    <meta name="author" content="Softnio">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="<?php echo $description ?>">
    <link rel="shortcut icon" href="../images/<?php echo $favicon ?>" type="image/x-icon">
    <!-- Fav Icon  -->
    <link rel="shortcut icon" href="../images/<?php echo $favicon ?>">
    <!-- Page Title  -->
    <title>Login |  Welcome to <?php  echo "$sitename";?> Online Banking</title>
    <!-- StyleSheets  -->
    <link rel="stylesheet" href="../assets/css/dashlite.css?ver=2.4.0">
    <link rel="stylesheet" href="../scss/sweetalert.css">
    <link id="skin-default" rel="stylesheet" href="../assets/css/theme.css?ver=2.4.0">
</head>
<body class="nk-body npc-crypto bg-white pg-auth">
    <!-- app body @s -->
    <div class="nk-app-root">
        <div class="nk-split nk-split-page nk-split-md">
            <div class="nk-split-content nk-block-area nk-block-area-column nk-auth-container bg-white">
                <div class="absolute-top-right d-lg-none p-3 p-sm-5">
                    <a href="#" class="toggle btn-white btn btn-icon btn-light" data-target="athPromo"><em class="icon ni ni-info"></em></a>
                </div>
                <div class="nk-block nk-block-middle nk-auth-body">
                    <div class="brand-logo pb-5">
                        <a href="../" class="logo-link">
                            <img class="logo-light logo-img logo-img-lg" src="../<?php echo$logo?>" srcset="../<?php echo $logo ?>" alt="logo">
                            <img class="logo-dark logo-img logo-img-lg" src="../<?php echo $logo ?>" srcset="../<?php echo $logo ?>" alt="logo-dark">
                        </a>
                    </div>
                    <?php  echo $stockrate ?>
                    <br>
                    <div class="nk-block-head">
                        <div class="nk-block-head-content">
                            <h5 class="nk-block-title">Sign-In</h5>
                            <div class="nk-block-des alert alert-pro alert-primary">
                                <p class="alert-text">Access the <?php echo $sitename ?> online banking panel using your Email address and password.</p>
                            </div>
                        </div>
                    </div><!-- .nk-block-head -->
                    <?php
                    if (isset($_POST['loginForm'])) {
    $email = filterString($_POST['email']);
    $password = filterString($_POST['password']);
    $errorMsg = 0;
    if (empty($email) || empty($password)) {
        echo "<div class='alert alert-danger alert-dismissible'>All fields are required!</div>";
        $errorMsg = 1;
    }
   if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
    }else{
       $errorMsg = 1;
        echo "<div class='alert alert-danger alert-dismissible'>Valid email is required!</div>";
    }

   
    if($errorMsg == 0){
    $pass = md5($password);
    $conn->set_charset('charset');
    $query = $conn->query("SELECT * FROM users WHERE email = '$email' AND password = '$pass' AND id = 1");
    if (mysqli_num_rows($query) < 1) {
       echo "<div class='alert alert-danger alert-dismissible'>Invalid Email address or passwordd</div>"; 
       
    }else{
         echo "<div class='alert alert-success alert-dismissible'>You have successfully login!</div>";
         $_SESSION['userAdmin'] = randomString(64);
         $_SESSION['loggedAdmin'] = 1;
         $token = $_SESSION['userAdmin'];
        $ip = $_SERVER["REMOTE_ADDR"];
        $dated = date("d M y, H:i a");
        $browser = $_SERVER["HTTP_USER_AGENT"];
        $queryyy = $conn->query("INSERT INTO login(ip, browser, dated, token, userid) VALUES ('$ip', '$browser', '$dated', '$token', 1)");
         ?>
         <meta http-equiv="refresh" content="3; url=account_manager?accessToken=<?php echo $_SESSION['userAdmin']; ?>"> 
         <?php
    }
}
                    }
                    ?>
                    <form action="#" method="post">
                        <div class="form-group">
                            <div class="form-label-group">
                                <label class="form-label" for="default-01">Email address</label>
                                <a class="link link-primary link-sm" tabindex="-1" href="#">Need Help?</a>
                            </div>
                            <input type="text" class="form-control form-control-lg" autocomplete="off" id="default-01" placeholder="Enter your Email address" name="email">
                        </div><!-- foem-group -->
                        <div class="form-group">
                            <div class="form-label-group">
                                <label class="form-label" for="password">Passsword</label>
                                <a class="link link-primary link-sm" tabindex="-1" href="#">Forgot Code?</a>
                            </div>
                            <div class="form-control-wrap">
                                <a tabindex="-1" href="#" class="form-icon form-icon-right passcode-switch" data-target="password">
                                    <em class="passcode-icon icon-show icon ni ni-eye"></em>
                                    <em class="passcode-icon icon-hide icon ni ni-eye-off"></em>
                                </a>
                                <input type="password" class="form-control form-control-lg" id="password" placeholder="Enter your password" name="password">
                            </div>
                        </div><!-- .foem-group -->
                        <div class="form-group">
                            <button class="btn btn-lg btn-primary btn-block" type="submit" name="loginForm">Continue</button>
                        </div>
                    </form><!-- form -->
                </div><!-- .nk-block -->
                <div class="nk-block nk-auth-footer">
                    <div class="nk-block-between">
                        <ul class="nav nav-sm">
                            <li class="nav-item">
                                <a class="nav-link" href="#">Terms & Condition</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#">Privacy Policy</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#">Help</a>
                            </li>
                            <li class="nav-item dropup">
                                <a class="dropdown-toggle dropdown-indicator has-indicator nav-link" data-toggle="dropdown" data-offset="0,10"><small>English</small></a>
                                <div class="dropdown-menu dropdown-menu-sm dropdown-menu-right">
                                    <ul class="language-list">
                                        <li>
                                            <a href="#" class="language-item">
                                                <img src="../images/flags/english.png" alt="" class="language-flag">
                                                <span class="language-name">English</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" class="language-item">
                                                <img src="../images/flags/spanish.png" alt="" class="language-flag">
                                                <span class="language-name">Español</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" class="language-item">
                                                <img src="../images/flags/french.png" alt="" class="language-flag">
                                                <span class="language-name">Français</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" class="language-item">
                                                <img src="../images/flags/turkey.png" alt="" class="language-flag">
                                                <span class="language-name">Türkçe</span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                        </ul><!-- .nav -->
                    </div>
                   <div class="mt-3">
                        <p>&copy; <?php echo "".date("Y").""; ?> <?php echo$sitename; ?>. All Rights Reserved.</p>
                    </div>
                </div><!-- .nk-block -->
            </div><!-- .nk-split-content -->
            <div class="nk-split-content nk-split-stretch bg-lighter d-flex toggle-break-lg toggle-slide toggle-slide-right" data-content="athPromo" data-toggle-screen="lg" data-toggle-overlay="true">
                <div class="slider-wrap w-100 w-max-550px p-3 p-sm-5 m-auto">
                    <div class="slider-init" data-slick='{"dots":true, "arrows":false}'>
                        <div class="slider-item">
                            <div class="nk-feature nk-feature-center">
                                <div class="nk-feature-img">
                                    <img class="round" src="../images/slides/secure-login.svg" srcset="../images/slides/secure-login.svg 2x" alt="">
                                </div>
                                <div class="nk-feature-content py-4 p-sm-5">
                                    <h4>Protect your online banking.</h4>
                                    <p>We have security measures in place to safeguard your money, because we are committed to providing you with a secure banking experience. When we come across any hoaxes or scams that target customers, we will raise them to your attention.</p>
                                </div>
                            </div>
                        </div><!-- .slider-item -->
                        <div class="slider-item">
                            <div class="nk-feature nk-feature-center">
                                <div class="nk-feature-img">
                                    <img class="round" src="../images/slides/security.svg" srcset="../images/slides/security.svg 2x" alt="">
                                </div>
                                <div class="nk-feature-content py-4 p-sm-5">
                                    <h4><?php echo$sitename ?></h4>
                                    <p>We'll never send an email containing a link to <?php echo "$sitename"; ?>.<br> 
                                      We'll never ask for your passwords or Secret Code.</p>
                                </div>
                            </div>
                        </div><!-- .slider-item -->
                        <div class="slider-item">
                            <div class="nk-feature nk-feature-center">
                                <div class="nk-feature-img">
                                    <img class="round" src="../images/slides/onlinebanking.svg" srcset="../images/slides/onlinebanking.svg 2x" alt="">
                                </div>
                                <div class="nk-feature-content py-4 p-sm-5">
                                    <h4><?php echo $sitename ?></h4>
                                    <p>When accessing <?php echo $sitename ?> online banking, always open a new browser window and type <?php url();?></p>
                                </div>
                            </div>
                        </div><!-- .slider-item -->
                    </div><!-- .slider-init -->
                    <div class="slider-dots"></div>
                    <div class="slider-arrows"></div>
                </div><!-- .slider-wrap -->
            </div><!-- .nk-split-content -->
        </div><!-- .nk-split -->
    </div><!-- app body @e -->
    <!-- JavaScript -->
    <script src="../assets/js/bundle.js?ver=2.4.0"></script>
    <script src="../assets/js/scripts.js?ver=2.4.0"></script>
   <script src="../js/vendors/sweetalert.js"></script>
</body>

</html>