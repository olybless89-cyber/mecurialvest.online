<?php include("../scripts/functions.php"); 
checkAdmin();

?>

<!DOCTYPE html>
<html lang="zxx" class="js">
 <head>
    <meta charset="utf-8">
    <meta name="author" content="Smart">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="<?php echo $description ?>">
    <!-- Fav Icon  -->
    <link rel="shortcut icon" href="../images/<?php echo$favicon ?>">
    <!-- Page Title  -->
    <title>Account Manager | <?php echo $sitename ?></title>
    <!-- StyleSheets  -->
    <link rel="stylesheet" href="../scss/sweetalert.css">
    <link rel="stylesheet" href="../assets/css/dashlite.css?ver=2.4.0">
    <link id="skin-default" rel="stylesheet" href="../assets/css/theme.css?ver=2.4.0">
     <link rel="stylesheet" type="text/css" href="../assets/css/libs/fontawesome-icons.css"> 
     <link href="../css/toastr.css" rel="stylesheet"/>
      <link rel="stylesheet" href="https://www.jqueryscript.net/demo/jQuery-International-Telephone-Input-With-Flags-Dial-Codes/build/css/intlTelInput.css">
   </head>
   <script type="text/javascript">
function googleTranslateElementInit() {
  new google.translate.TranslateElement({pageLanguage: 'en', layout: google.translate.TranslateElement.InlineLayout.SIMPLE}, 'google_translate_element');
}
</script>
<script type="text/javascript" src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
    <style>
.goog-te-gadget-simple {
border:none;
}
.goog-te-gadget-simple a {
color:#000;
}
</style>
<body class="nk-body bg-white has-sidebar ">
    <div class="nk-app-root">
        <!-- main @s -->
        <div class="nk-main ">
            <!-- sidebar @s -->
            <div class="nk-sidebar nk-sidebar-fixed " data-content="sidebarMenu">
                <div class="nk-sidebar-element nk-sidebar-head">
                    <div class="nk-sidebar-brand">
                        <a href="account_manager" class="logo-link nk-sidebar-logo">
                            <img class="logo-light logo-img" src="../<?php echo$logo ?>" srcset="../<?php echo$logo ?> 2x" alt="logo">
                            <img class="logo-dark logo-img" src="../<?php echo$logo ?>" srcset="../<?php echo$logo ?> 2x" alt="logo-dark">
                        </a>
                    </div>
                    <div class="nk-menu-trigger mr-n2">
                        <a href="#" class="nk-nav-toggle nk-quick-nav-icon d-xl-none" data-target="sidebarMenu"><em class="icon ni ni-arrow-left"></em></a>
                    </div>
                </div><!-- .nk-sidebar-element -->
                <div class="nk-sidebar-element">
                    <div class="nk-sidebar-body" data-simplebar>
                        <div class="nk-sidebar-content">
                            <div class="nk-sidebar-menu">
                                <ul class="nk-menu">
                                    <li class="nk-menu-heading">
                                        <h6 class="overline-title text-primary-alt">Quick Action</h6>
                                    </li><!-- .nk-menu-item -->
                                    <li class="nk-menu-item">
                                        <a href="users" class="nk-menu-link">
                                            <span class="nk-menu-icon"><em class="icon ni ni-user"></em></span>
                                            <span class="nk-menu-text">Create a user account</span><span class="nk-menu-badge badge-danger">Now</span>
                                        </a>
                                    </li><!-- .nk-menu-item -->
                                    <li class="nk-menu-heading">
                                        <h6 class="overline-title text-primary-alt">Dashboards</h6>
                                    </li><!-- .nk-menu-item -->
                                    <li class="nk-menu-item">
                                        <a href="transactions" class="nk-menu-link">
                                            <span class="nk-menu-icon"><em class="icon ni ni-tranx"></em></span>
                                            <span class="nk-menu-text">Transactions</span>
                                        </a>
                                    </li><!-- .nk-menu-item -->
                                    <li class="nk-menu-item">
                                        <a href="bills" class="nk-menu-link">
                                            <span class="nk-menu-icon"><em class="icon ni ni-coins"></em></span>
                                            <span class="nk-menu-text">Bill payments</span>
                                        </a>
                                    </li><!-- .nk-menu-item -->
                                    <li class="nk-menu-item">
                                        <a href="check_deposits" class="nk-menu-link">
                                            <span class="nk-menu-icon"><em class="icon ni ni-cc-alt2"></em></span>
                                            <span class="nk-menu-text">Check Deposits</span>
                                        </a>
                                    </li><!-- .nk-menu-item -->
                                    <li class="nk-menu-item">
                                        <a href="fund_user" class="nk-menu-link">
                                            <span class="nk-menu-icon"><em class="icon ni ni-wallet-fill"></em></span>
                                            <span class="nk-menu-text">Fund a user account</span>
                                        </a>
                                    </li><!-- .nk-menu-item -->
                                     <li class="nk-menu-item">
                                        <a href="email_user" class="nk-menu-link">
                                            <span class="nk-menu-icon"><em class="icon ni ni-chat-fill"></em></span>
                                            <span class="nk-menu-text">Send Email</span>
                                        </a>
                                    </li><!-- .nk-menu-item -->
                                     <?php 
                                      if ($crypto == 1) {
                                          ?>
                                    <li class="nk-menu-item has-sub">
                                        <a href="#" class="nk-menu-link bg-primary text-light nk-menu-toggle">
                                            <span class="nk-menu-icon"><em class="icon ni ni-bitcoin"></em></span>
                                            <span class="nk-menu-text">Crypto Currency</span>
                                        </a>
                                        <ul class="nk-menu-sub">
                                            <li class="nk-menu-item">
                                                <a href="crypto" class="nk-menu-link"><span class="nk-menu-text">Crypto Management</span></a>
                                            </li>
                                            <li class="nk-menu-item">
                                                <a href="crypto?action=approved_deposits" class="nk-menu-link"><span class="nk-menu-text">Approved Deposits</span></a>
                                            </li>
                                            <li class="nk-menu-item">
                                                <a href="crypto?action=pending_deposits" class="nk-menu-link"><span class="nk-menu-text">Pending Deposits <span class="badge badge-primary"><?php $query=$conn->query("SELECT * FROM crypto_deposits WHERE status = 'pending'");
                                                echo mysqli_num_rows($query); ?></span></span></a>
                                            </li>
                                            <li class="nk-menu-item">
                                                <a href="crypto?action=rejected_deposits" class="nk-menu-link"><span class="nk-menu-text">Rejected Deposits</span></a>
                                            </li>
                                            <li class="nk-menu-item">
                                                <a href="crypto?action=withrawal_requests" class="nk-menu-link"><span class="nk-menu-text">Withdrawal Requests <span class="badge badge-primary"><?php $query=$conn->query("SELECT * FROM crypto_withdrawals WHERE status = 'pending'");
                                                echo mysqli_num_rows($query); ?></span></span></a>
                                            </li>
                                        </ul><!-- .nk-menu-sub -->
                                    </li><!-- .nk-menu-item -->
                                          <?php
                                      }
                                    ?>
                                 <?php  if ($visual_card == 1) { ?>
                                     <li class="nk-menu-item">
                                        <a href="visual_card" class="nk-menu-link">
                                            <span class="nk-menu-icon"><em class="icon ni ni-cc-alt2-fill"></em></span>
                                            <span class="nk-menu-text">Visual Cards</span>
                                        </a>
                                    </li>
                                   <?php  }?>
                                     <?php  if ($kyc == 1) { ?>
                                     <li class="nk-menu-item">
                                        <a href="kyc" class="nk-menu-link">
                                            <span class="nk-menu-icon"><em class="icon ni ni-file-docs"></em></span>
                                            <span class="nk-menu-text">KYC Application</span>
                                        </a>
                                    </li>
                                    <?php }?>
                                     <?php 
                                      if ($loan == 1) {
                                          ?>
                                    <li class="nk-menu-item has-sub">
                                        <a href="#" class="nk-menu-link  nk-menu-toggle">
                                            <span class="nk-menu-icon"><em class="icon ni ni-repeat"></em></span>
                                            <span class="nk-menu-text">Loan/Credit Financing</span>
                                        </a>
                                        <ul class="nk-menu-sub">
                                            <li class="nk-menu-item">
                                                <a href="loan" class="nk-menu-link"><span class="nk-menu-text">Loan Management</span></a>
                                            </li>
                                          
                                            <li class="nk-menu-item">
                                                <a href="loan_requests" class="nk-menu-link"><span class="nk-menu-text">Loan Requests <span class="badge badge-primary"><?php $query=$conn->query("SELECT * FROM loan_application WHERE status = 'pending'");
                                                echo mysqli_num_rows($query); ?></span></span></a>
                                            </li>
                                        </ul><!-- .nk-menu-sub -->
                                    </li><!-- .nk-menu-item -->
                                          <?php
                                      }
                                    ?>

                                     <li class="nk-menu-item">
                                        <a href="support" class="nk-menu-link">
                                            <span class="nk-menu-icon"><em class="icon ni ni-help-alt"></em></span>
                                            <span class="nk-menu-text">Support ticket</span>
                                        </a>
                                    </li><!-- .nk-menu-item -->  
                                     <li class="nk-menu-item">
                                        <a href="Settings" class="nk-menu-link">
                                            <span class="nk-menu-icon"><em class="icon ni ni-setting"></em></span>
                                            <span class="nk-menu-text">General Settings</span>
                                        </a>
                                    </li><!-- .nk-menu-item -->
                                    <li class="nk-menu-item">
                                        <a href="branding" class="nk-menu-link">
                                            <span class="nk-menu-icon"><em class="icon ni ni-camera"></em></span>
                                            <span class="nk-menu-text">Logo & Favicon</span>
                                        </a>
                                    </li><!-- .nk-menu-item -->
                                     <li class="nk-menu-item">
                                        <a href="plugins" class="nk-menu-link">
                                            <span class="nk-menu-icon"><em class="icon ni ni-toolbar"></em></em></span>
                                            <span class="nk-menu-text">Plugins</span>
                                        </a>
                                    </li><!-- .nk-menu-item -->
                                    <li class="nk-menu-item">
                                        <a href="smtp" class="nk-menu-link">
                                            <span class="nk-menu-icon"><em class="icon ni ni-setting-alt-fill"></em></span>
                                            <span class="nk-menu-text">Email & SMS Configuration</span>
                                        </a>
                                    </li><!-- .nk-menu-item -->
                                     <li class="nk-menu-item">
                                        <a href="sliders" class="nk-menu-link">
                                            <span class="nk-menu-icon"><em class="icon ni ni-camera-fill"></em></span>
                                            <span class="nk-menu-text">Slider Setting</span>
                                        </a>
                                    </li><!-- .nk-menu-item -->  
                                    <li class="nk-menu-item">
                                        <a href="miscellaneous" class="nk-menu-link">
                                            <span class="nk-menu-icon"><em class="icon ni ni-opt-dot-fill"></em></span>
                                            <span class="nk-menu-text">Miscellaneous</span>
                                        </a>
                                    </li><!-- .nk-menu-item -->


                                </ul><!-- .nk-menu -->
                            </div><!-- .nk-sidebar-menu -->
                            <div class="nk-sidebar-footer">
                                <ul class="nk-menu nk-menu-footer">
                                   
                            <a href="#" style=""><div id="google_translate_element"></div> </a>
                                </ul>
                            </div><!-- .nk-sidebar-footer -->
                        </div><!-- .nk-sidebar-content -->
                    </div><!-- .nk-sidebar-body -->
                </div><!-- .nk-sidebar-element -->
            </div>
            <!-- sidebar @e -->
            <!-- wrap @s -->
            <div class="nk-wrap ">
                <!-- main header @s -->
                <div class="nk-header nk-header-fixed is-light">
                    <div class="container-fluid">
                        <div class="nk-header-wrap">
                            <div class="nk-menu-trigger d-xl-none ml-n1">
                                <a href="#" class="nk-nav-toggle nk-quick-nav-icon" data-target="sidebarMenu"><em class="icon ni ni-menu"></em></a>
                            </div>
                            <div class="nk-header-brand d-xl-none">
                                <a href="html/index.html" class="logo-link">
                                    <img class="logo-light logo-img" src="../<?php echo$logo ?>" srcset="../<?php echo$logo ?>" alt="logo">
                                    <img class="logo-dark logo-img" src="../<?php echo$logo ?>" srcset="../<?php echo$logo ?> 2x" alt="logo-dark">
                                </a>
                            </div><!-- .nk-header-brand -->
                            <div class="nk-header-news d-none d-xl-block">
                                <div class="nk-news-list">
                                    <a class="nk-news-item" href="#">
                                        <div class="nk-news-icon">
                                            <em class="icon ni ni-card-view"></em>
                                        </div>
                                        <div class="nk-news-text">
                                            <p>Do you know the latest update of 2019? <span> A overview of our is now available on YouTube</span></p>
                                            <em class="icon ni ni-external"></em>
                                        </div>
                                    </a>
                                </div>
                            </div><!-- .nk-header-news -->
                            <div class="nk-header-tools">
                                <ul class="nk-quick-nav">
                                    <li class="dropdown user-dropdown">
                                        <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                                            <div class="user-toggle">
                                                <div class="user-avatar sm">
                                                    <em class="icon ni ni-user-alt"></em>
                                                </div>
                                                <div class="user-info d-none d-md-block">
                                                    <div class="user-status">Administrator</div>
                                                    <div class="user-name dropdown-indicator"><?php echo "$adfirstname $admiddlename $adlastname"; ?></div>
                                                </div>
                                            </div>
                                        </a>
                                        <div class="dropdown-menu dropdown-menu-md dropdown-menu-right dropdown-menu-s1">
                                            <div class="dropdown-inner user-card-wrap bg-lighter d-none d-md-block">
                                                <div class="user-card">
                                                    <div class="user-avatar">
                                                        <span>AB</span>
                                                    </div>
                                                    <div class="user-info">
                                                        <span class="lead-text"><?php echo "$adfirstname $admiddlename $adlastname"; ?></span>
                                                        <span class="sub-text"><?php echo "$ademail"; ?></span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="dropdown-inner">
                                                <ul class="link-list">
                                                    <li><a href="admin_profile"><em class="icon ni ni-user-alt"></em><span>View Profile</span></a></li>
                                                    <li><a href="admin_profile_setting"><em class="icon ni ni-setting-alt"></em><span>Account Setting</span></a></li>
                                                      <li><a href="admin_login_activities"><em class="icon ni ni-activity-alt"></em><span>Login Activity</span></a></li>
                                                    <li><a class="dark-switch" href="#"><em class="icon ni ni-moon"></em><span>Dark Mode</span></a></li>
                                                </ul>
                                            </div>
                                            <div class="dropdown-inner">
                                                <ul class="link-list">
                                                    <li><a href="logout"><em class="icon ni ni-signout"></em><span>Sign out</span></a></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </li><!-- .dropdown -->
                                </ul><!-- .nk-quick-nav -->
                            </div><!-- .nk-header-tools -->
                        </div><!-- .nk-header-wrap -->
                    </div><!-- .container-fliud -->
                </div>
               