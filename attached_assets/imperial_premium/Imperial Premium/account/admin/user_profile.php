
<?php 
if(empty($_GET['id'])){
	header("location:users");
}

include("header.php"); ?>
    <?php
    $id = $_GET['id'];
    $userquery = $conn->query("SELECT * FROM users WHERE id = '$id'");
    while($userdetails = mysqli_fetch_array($userquery)){
    $firstname = $userdetails["firstname"];
    $middlename = $userdetails["middlename"];
    $lastname = $userdetails["lastname"];
    $email = $userdetails["email"];
    $accounttype = $userdetails["accounttype"];
    $passport = $userdetails["passport"];
    $dayOFBirth = $userdetails["dob"];
    $accountbalance = $userdetails["accountbalance"];
    $address = $userdetails["address"];
    $state = $userdetails["state"];
    $country = $userdetails["country"];
    $phone = $userdetails["phone"];
    $secretCode = $userdetails["secretCode"];
    $zipcode = $userdetails["zipcode"];
    $income = $userdetails["income"];
    $occupation = $userdetails["occupation"];
    $nickname = $userdetails["nickname"];
    $securityQuestion = $userdetails["securityquestion"];
    $answer = $userdetails["answer"];
    $userid = $userdetails["id"];
    $usercurrency = $userdetails["usercurrency"];
    $fullname = "$firstname $middlename $lastname";
    $accountnumber = $userdetails["accountnumber"];
    $userimf = $userdetails['imf'];
    $usercot = $userdetails['cot'];
    $email_verify = $userdetails['email_verify'];
    if($email_verify != 0){
    	$emailVerify = '<li><em class="icon text-success ni ni-check-circle"></em> <span>Email</span></li>';
    }else{$emailVerify = '  <li><em class="icon text-danger ni ni-alert-circle"></em> <span>Email</span></li>';}

    if($userdetails['status'] == 'pending'){
    	$suspend = ' <li><a class="" href="unblock?id='.$userid.'"><em class="icon ni ni-user-fill-c"></em><span>Unblock account</span></a></li>';
    	$stat = '<span class="tb-status text-danger">Suspended</span>';
    }else {$stat = '<span class="tb-status text-success">Active</span>';
     $suspend = ' <li><a class="" href="suspend?id='.$userid.'"><em class="icon ni ni-user-fill-c"></em><span>Suspend account</span></a></li>';
    }
}

?>
             <!-- content @s -->
                <div class="nk-content nk-content-fluid">
                    <div class="container-xl wide-lg">
                        <div class="nk-content-body">
                            <div class="nk-block">
                                <div class="card card-bordered">
                                    <div class="card-aside-wrap">
                                        <div class="card-inner card-inner-lg">
                                            <div class="nk-block-head nk-block-head-lg">
                                                <div class="nk-block-between">
                                                    <div class="nk-block-head-content">
                                                        <h4 class="nk-block-title">Personal Information</h4>
                                                        <div class="nk-block-des">
                                                            <p>Basic info, like name, address etc.</p>
                                                        </div>
                                                    </div>
                                                    <div class="nk-block-head-content align-self-start d-lg-none">
                                                        <a href="#" class="toggle btn btn-icon btn-trigger mt-n1" data-target="userAside"><em class="icon ni ni-menu-alt-r"></em></a>
                                                    </div>
                                                </div>
                                            </div><!-- .nk-block-head -->
                                            <div class="nk-block">
                                                <div class="nk-data data-list">
                                                    <div class="data-head">
                                                        <h6 class="overline-title">Basics</h6>
                                                    </div>
                                                    <div class="data-item" data-toggle="modal" data-target="#profile-edit">
                                                        <div class="data-col">
                                                            <span class="data-label">Full Name</span>
                                                            <span class="data-value"><?php echo$fullname ?></span>
                                                        </div>
                                                        <div class="data-col data-col-end"><span class="data-more"><em class="icon ni ni-forward-ios"></em></span></div>
                                                    </div><!-- data-item -->
                                                    <div class="data-item">
                                                        <div class="data-col">
                                                            <span class="data-label">Email</span>
                                                            <span class="data-value"><?php echo$email ?></span>
                                                        </div>
                                                        <div class="data-col data-col-end"><span class="data-more disable"><em class="icon ni ni-lock-alt"></em></span></div>
                                                    </div><!-- data-item -->
                                                    <div class="data-item" data-toggle="modal" data-target="#profile-edit">
                                                        <div class="data-col">
                                                            <span class="data-label">Phone Number</span>
                                                            <span class="data-value text-soft"><?php echo$phone ?></span>
                                                        </div>
                                                        <div class="data-col data-col-end"><span class="data-more"><em class="icon ni ni-forward-ios"></em></span></div>
                                                    </div><!-- data-item -->
                                                    <div class="data-item" data-toggle="modal" data-target="#profile-edit">
                                                        <div class="data-col">
                                                            <span class="data-label">Date of Birth</span>
                                                            <span class="data-value"><?php echo$dayOFBirth ?></span>
                                                        </div>
                                                        <div class="data-col data-col-end"><span class="data-more"><em class="icon ni ni-forward-ios"></em></span></div>
                                                    </div><!-- data-item -->
                                                    <div class="data-item" data-toggle="modal" data-target="#profile-edit" data-tab-target="#address">
                                                        <div class="data-col">
                                                            <span class="data-label">Address</span>
                                                            <span class="data-value"><?php echo$address ?></span>
                                                        </div>
                                                        <div class="data-col data-col-end"><span class="data-more"><em class="icon ni ni-forward-ios"></em></span></div>
                                                    </div><!-- data-item -->
                                                     <div class="data-item" data-toggle="modal" data-target="#profile-edit" data-tab-target="#address">
                                                        <div class="data-col">
                                                            <span class="data-label">IMF CODE</span>
                                                            <span class="data-value"><?php echo$userimf ?></span>
                                                        </div>
                                                        <div class="data-col data-col-end"><span class="data-more"><em class="icon ni ni-forward-ios"></em></span></div>
                                                    </div><!-- data-item -->
                                                     <div class="data-item" data-toggle="modal" data-target="#profile-edit" data-tab-target="#address">
                                                        <div class="data-col">
                                                            <span class="data-label">COT code</span>
                                                            <span class="data-value"><?php echo$usercot ?></span>
                                                        </div>
                                                        <div class="data-col data-col-end"><span class="data-more"><em class="icon ni ni-forward-ios"></em></span></div>
                                                    </div><!-- data-item -->
                                                </div><!-- data-list -->
                                                <div class="nk-data data-list">
                                                    <div class="data-head">
                                                        <h6 class="overline-title">Preferences</h6>
                                                    </div>
                                                    <div class="data-item">
                                                        <div class="data-col">
                                                            <span class="data-label">Language</span>
                                                            <span class="data-value">English (United State)</span>
                                                        </div>
                                                        <div class="data-col data-col-end"><a href="#" data-toggle="modal" data-target="#profile-language" class="link link-primary">Change Language</a></div>
                                                    </div><!-- data-item -->
                                                    <div class="data-item">
                                                        <div class="data-col">
                                                            <span class="data-label">Date Format</span>
                                                            <span class="data-value">M d, YYYY</span>
                                                        </div>
                                                        <div class="data-col data-col-end"><a href="#" data-toggle="modal" data-target="#profile-language" class="link link-primary">Change</a></div>
                                                    </div><!-- data-item -->
                                                    <div class="data-item">
                                                        <div class="data-col">
                                                            <span class="data-label">Country</span>
                                                            <span class="data-value"><?php echo $country; ?></span>
                                                        </div>
                                                        <div class="data-col data-col-end"><a href="#" data-toggle="modal" data-target="#profile-language" class="link link-primary">Change</a></div>
                                                    </div><!-- data-item -->
                                                </div><!-- data-list -->
                                            </div><!-- .nk-block -->
                                        </div>
                                        <div class="card-aside card-aside-left user-aside toggle-slide toggle-slide-left toggle-break-lg" data-content="userAside" data-toggle-screen="lg" data-toggle-overlay="true">
                                            <div class="card-inner-group" data-simplebar>
                                                <div class="card-inner">
                                                    <div class="user-card">
                                                        <div class="user-avatar bg-primary">
                                                        	<?php 
                                                            if($passport != ""){
                                                            	echo "<img src='../secure/passport/$passport'>";
                                                            }
                                                            else{
                                                        	?>
                                                            <span><?php echo substr($fullname, 0, 2) ?></span>
                                                        <?php }?>
                                                        </div>
                                                        <div class="user-info">
                                                            <span class="lead-text"><?php echo$fullname ?></span>

                                                            <span class="sub-text"><?php echo$email ?></span>
                                                        </div>
                                                        <div class="user-action">
                                                            <div class="dropdown">
                                                                <a class="btn btn-icon btn-trigger mr-n2" data-toggle="dropdown" href="#"><em class="icon ni ni-more-v"></em></a>
                                                                <div class="dropdown-menu dropdown-menu-right">
                                                                    <ul class="link-list-opt no-bdr">
                                                                        <li><a href="update_photo?id=<?php echo$id ?>"><em class="icon ni ni-camera-fill"></em><span>Change Photo</span></a></li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div><!-- .user-card -->
                                                </div><!-- .card-inner -->
                                                <div class="card-inner">
                                                    <div class="user-account-info py-0">
                                                        <h6 class="overline-title-alt"><?php echo$accounttype ?></h6>
                                                        <div class="user-balance"><?php echo$accountbalance ?><small class="currency currency-btc"><?php echo$money ?></small>
                                                        </div>
                                                         <span class="lead-text">Account # :<?php echo$accountnumber ?></span>
                                                    </div>
                                                </div><!-- .card-inner -->
                                                <div class="card-inner p-0">
                                                    <ul class="link-list-menu">
                                                    	 <li><a class="active" href="#"><em class="icon ni ni-user-fill-c"></em><span>Personal Infomation</span></a></li>
                                                    	 <li><a class="" href="fund_user?accountnumber=<?php echo$accountnumber ?>&id=<?php echo$id ?>"><em class="icon ni ni-wallet-in"></em><span>Credit Account</span></a></li>
                                                    	 <li><a class="" href="user_transaction?id=<?php echo$id ?>"><em class="icon ni ni-tranx"></em><span>Transaction History</span></a></li>

                                                    	  <li><a class="" href="debit_user?accountnumber=<?php echo$accountnumber ?>&id=<?php echo$id ?>"><em class="icon ni ni-wallet-out"></em><span>Debit Account</span></a></li>
                                                       
                                                        <li><a href="update_photo?id=<?php echo$id ?>"><em class="icon ni ni-camera-fill"></em><span>Change Photo</span></a></li>
                                                        
                                                        <li><a href="user_activity?id=<?php echo$id ?>"><em class="icon ni ni-activity-round-fill"></em><span>Account Activity</span></a></li>
                                                        <li><a href="user_password_reset?id=<?php echo$userid; ?>"><em class="icon ni ni-lock-alt-fill"></em><span>Security Settings</span></a></li>
                                                    </ul>
                                                </div><!-- .card-inner -->
                                            </div><!-- .card-inner-group -->
                                        </div><!-- card-aside -->
                                    </div><!-- .card-aside-wrap -->
                                </div><!-- .card -->
                            </div><!-- .nk-block -->
                        </div>
                    </div>
               
       
    <!-- @@ Profile Edit Modal @e -->
    <div class="modal fade" tabindex="-1" role="dialog" id="profile-edit">
        <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
                <a href="#" class="close" data-dismiss="modal"><em class="icon ni ni-cross-sm"></em></a>
                <div class="modal-body modal-body-lg">
                    <h5 class="title">Update Account Details</h5>
                    <ul class="nk-nav nav nav-tabs">
                        <li class="nav-item">
                            <a class="nav-link active" data-toggle="tab" href="#personal">Personal</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" data-toggle="tab" href="#address">Banking Details</a>
                        </li>
                    </ul><!-- .nav-tabs -->
                    <div class="tab-content">
                        <div class="tab-pane active" id="personal">
                            <div class="row gy-4">
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label class="form-label" for="full-name">First Name</label>
                                        <input type="text" class="form-control form-control-lg" value="<?php echo$firstname ?>" placeholder="Enter Firstname" name="firstname" id="firstname">
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label class="form-label" for="full-name">Middle Name</label>
                                        <input type="text" name="middlename" id="middlename" class="form-control form-control-lg"  value="<?php echo$middlename ?>" placeholder="Enter Middlename">
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label class="form-label" for="full-name">Last Name</label>
                                        <input type="text" name="lastname" id="lastname" class="form-control form-control-lg"  value="<?php echo$lastname ?>" placeholder="Enter Lastname">
                                    </div>
                                </div>
                               
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label class="form-label" for="phone-no">Phone Number</label>
                                        <input type="text" class="form-control form-control-lg" id="phone" name="phone" value="<?php echo$phone ?>" placeholder="Phone Number">
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label class="form-label" for="email">Email address</label>
                                        <input type="text" class="form-control form-control-lg" name="email" id="email" value="<?php echo$email ?>">
                                    </div>
                                </div>
                                 <div class="col-md-4">
                                    <div class="form-group">
                                        <label class="form-label" for="birth-day">Date of Birth</label>
                                        <input type="text" class="form-control form-control-lg date-picker" value="<?php echo$dayOFBirth ?>" id="dob" name="dob" >
                                    </div>
                                </div>
                                <div class="col-md-12">
                                    <div class="form-group">
                                        <label class="form-label" for="birth-day">Address</label>
                                        <input type="text" class="form-control form-control-lg " id="addressB" name="addressB" value="<?php echo$address ?>">
                                    </div>
                                </div>
                                <div class="userUpdateResult"></div>
                                <div class="col-12">
                                    <ul class="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                                        <li>
                                            <button type="submit" class="btn btn-lg btn-primary userUpdate">Update Profile</button>
                                        </li>
                                        <li>
                                            <a href="#" data-dismiss="modal" class="link link-light">Cancel</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div><!-- .tab-pane -->
                        <div class="tab-pane" id="address">
                            <div class="row gy-4">
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label class="form-label" for="address-l1">Account Type</label>
                                        <select type="text" class="form-control form-control-lg" id="accounttype" name="accounttype" value="">
                                        	 <option value="Checking Account"><?php echo$accounttype ?></option>
                                        <option value="Checking Account">Checking Account</option>
						<option value="Savings Account">Saving Account</option>
						<option value="Fixed Deposit Account">Fixed Deposit Account</option>
						<option value="Current Account">Current Account</option>
						<option value="Business Account">Business Account</option>
						<option value="Non Resident Account">Non Resident Account</option>
						<option value="Cooperate Business Account">Cooperate Business Account</option>
						<option value="Investment Account">Investment Account</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label class="form-label" for="address-l2">Account Number</label>
                                        <input type="text" class="form-control form-control-lg" name="accountnumber" id="accountnumber" value="<?php echo$accountnumber ?>">
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label class="form-label" for="address-st">2FA pin</label>
                                        <input type="text" class="form-control form-control-lg" id="secretCode" name="secretCode" value="<?php echo$secretCode ?>">
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label class="form-label" for="address-st">Account Currency</label>
                                        <select type="text" class="form-control form-control-lg" id="usercurrency" name="usercurrency">
                                          <option><?php echo$usercurrency ?></option>
                                          <?php include("../secure/currency.php"); ?>
                                        </select>	
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label class="form-label" for="address-st">IMF CODE</label>
                                        <input type="text" class="form-control form-control-lg" id="imf" name="imf" value="<?php echo$userimf ?>">
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label class="form-label" for="address-st">COT CODE</label>
                                        <input type="text" class="form-control form-control-lg" id="cot" name="cot" value="<?php echo$usercot ?>">
                                    </div>
                                </div>
                                </div>
                                <p></p>
                                <div class="bankUpdateResult"></div>
                                <div class="col-12">
                                    <ul class="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                                        <li>
                                            <button class="btn btn-lg btn-primary bankUpdate">Update Bank details</a>
                                        </li>
                                        <li>
                                            <a href="#" data-dismiss="modal" class="link link-light">Cancel</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div><!-- .tab-pane -->
                    </div><!-- .tab-content -->
                </div><!-- .modal-body -->
            </div><!-- .modal-content -->
        </div><!-- .modal-dialog -->
    </div><!-- .modal -->
    <!-- JavaScript -->
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
 <script type="text/javascript">  
 //UPDATING USER DETAILS             	
 $(document).ready(function() {
 $('.userUpdate').on('click', function() {
 var $this = $(this);
 var loadingText = '<i class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></i>&nbsp;Processing...';
 if ($(this).html() !== loadingText) {
 $this.data('original-text', $(this).html());
 $this.html(loadingText);
 }
 setTimeout(function() {
 $this.html($this.data('original-text'));
 },3000);
 });
 })
$(document).ready(function () {
    $('.userUpdate').click(function (e) {
      e.preventDefault();
      var firstname = $('#firstname').val();
      var middlename = $('#middlename').val();
      var lastname = $('#lastname').val();
      var phone = $('#phone').val();
      var email = $('#email').val();
      var dob = $('#dob').val();
      var addressB = $('#addressB').val();
      $.ajax
        ({
          type: "POST",
          url: "../scripts/update_user_detail.php?id=<?php echo$id?>",
          data: {"firstname": firstname, "middlename": middlename, "lastname": lastname, "phone": phone, "email": email, "dob": dob, "addressB": addressB},
          success: function (data) {
            $('.userUpdateResult').html(data);
            $('#form')[0].reset();
          }
        });
    });
  });

//UPDATING BANKING DETAILS
$(document).ready(function() {
 $('.bankUpdate').on('click', function() {
 var $this = $(this);
 var loadingText = '<i class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></i>&nbsp;Processing...';
 if ($(this).html() !== loadingText) {
 $this.data('original-text', $(this).html());
 $this.html(loadingText);
 }
 setTimeout(function() {
 $this.html($this.data('original-text'));
 },3000);
 });
 })
$(document).ready(function () {
    $('.bankUpdate').click(function (e) {
      e.preventDefault();
      var accounttype = $('#accounttype').val();
      var accountnumber = $('#accountnumber').val();
      var usercurrency = $('#usercurrency').val();
      var cot = $('#cot').val();
      var imf = $('#imf').val();
      var secretCode = $('#secretCode').val();
      $.ajax
        ({
          type: "POST",
          url: "../scripts/update_bank_detail.php?id=<?php echo$id ?>",
          data: {"accounttype": accounttype, "accountnumber": accountnumber, "usercurrency": usercurrency, "imf": imf, "cot": cot, "secretCode": secretCode},
          success: function (data) {
            $('.bankUpdateResult').html(data);
            $('#form')[0].reset();
          }
        });
    });
  });
  </script>

    <?php include("footer.php"); ?>
</body>

</html>