<?php
include("header.php");
?>

<div class="nk-content">
 <div class="container-xl wide-lg">
        <div class="nk-content-body">
        <div class="nk-block-head">
         <div class="nk-block-head-sub">
         </div>
           <div class="nk-block-between-md g-4 card-bordered">
             <div class="nk-block-head-content">
              <h4 class="nk-block-title fw-normal">Account Registration.</h4>
                <div class="nk-block-des">
                  <p>
                   </p>
                      </div>
                       </div>
                            <div class="nk-block-head-content">
                                        <ul class="nk-block-tools gx-3">
                                            <li><a href="account_manager" class="btn btn-primary"><span>Home</span> <em class="icon ni ni-arrow-left"></em></a></li>
                                            <li><a href="fund_user" class="btn btn-success"><span>Fund an account</span> <em class="icon ni ni-invest"></em></a></li>
                                        </ul>
                                    </div><!-- .nk-block-head-content -->
                                </div><!-- .nk-block-between -->
                            </div><!-- .nk-block-head -->
                        </div>
                    </div>
<div class="card card-bordered s-4 col-lg-12 p-0">
 <div class="card-header font-weight-bold text-light" style="background-color:#033d75;">
 	<h5 class="text-white"><em class="icon ni ni-user-add-fill"></em> Fill user details correctly</h5>
</div>	
<form action="" method="post">
<div class="card-body">
	<b>Personal Details</b>
	<hr>
<div class="row">
  <div class="col-md-4">
   <div class="form-group">
    <label class="form-label" for="phone-no">First Name</label>
     <input type="text" class="form-control" id="firstname" name="firstname" placeholder="First Name">
    </div>
   </div>
   <div class="col-md-4">
   <div class="form-group">
    <label class="form-label" for="phone-no">Middle name</label>
     <input type="text" class="form-control" id="middlename" name="middlename" placeholder="Middle Name">
    </div>
   </div>
    <div class="col-md-4">
   <div class="form-group">
    <label class="form-label" for="phone-no">Last Name</label>
     <input type="text" class="form-control" id="lastname" name="lastname" placeholder="Last Name">
    </div>
   </div>
   <label class="form-label col-lg-12">Address</label>
   <?php include("../personal-banking/wire2.php"); ?>
    <div class="col-md-2">
   <div class="form-group">
    <label class="form-label" for="phone-no">Zip code</label>
     <input type="text" class="form-control" id="zipcode" name="zipcode" placeholder="zipcode/postal code">
    </div>
   </div>
   <div class="col-md-2">
   <div class="form-group">
    <label class="form-label" for="phone-no">Date of Birth</label>
     <input type="text" class="form-control date-picker" id="dob" name="dob" placeholder="Date of Birth">
    </div>
   </div>
    <div class="col-md-8">
   <div class="form-group">
    <label class="form-label" for="phone-no">House Address</label>
     <input type="text" class="form-control" id="address" name="address" placeholder="House address">
    </div>
   </div>
 <div class="col-md-6">
   <div class="form-group">
    <label class="form-label" for="phone-no">Phone Number</label>
     <input type="text" class="form-control" id="phone" name="phone" placeholder="Phone Number">
    </div>
   </div>
    <div class="col-md-6">
   <div class="form-group">
    <label class="form-label" for="phone-no">Email address</label>
     <input type="email" class="form-control" id="email" name="email" placeholder="Enter Email address">
    </div>
   </div>
</div>	
<hr>
<b>Banking  Details</b>
	<hr>
	<div class="row">
  <div class="col-md-4">
   <div class="form-group">
    <label class="form-label" for="phone-no">Account Number</label>
     <input type="text" class="form-control" id="accountnumber" value="<?php echo randomNumber(10) ?>" name="accountnumber">
    </div>
   </div>
   <div class="col-md-4">
   <div class="form-group">
    <label class="form-label" for="phone-no">Account Type</label>
       <select type="text" class="form-control" id="accounttype" name="accounttype" value="">
          <option value="">Please select Account Type</option> 
            <option value="Checking Account">Checking Account</option>
            <option value="Savings Account">Saving Account</option>
            <option value="Fixed Deposit Account">Fixed Deposit Account</option>
            <option value="Current Account">Current Account</option>
            <option value="Crypto Currency Account">Crypto Currency Account</option>
            <option value="Business Account">Business Account</option>
            <option value="Non Resident Account">Non Resident Account</option>
            <option value="Cooperate Business Account">Cooperate Business Account</option>
            <option value="Investment Account">Investment Account</option>
          </select>
    </div>
   </div>
    <div class="col-md-4">
   <div class="form-group">
    <label class="form-label" for="phone-no">Account Currency</label>
     <select type="text" class="form-control" id="usercurrency" name="usercurrency">
     	<?php include("../secure/currency.php"); ?>
     </select>
    </div>
   </div>
    <div class="col-md-2">
   <div class="form-group">
    <label class="form-label" for="phone-no">Account Balance</label>
     <input type="number" class="form-control" id="accountbalance" name="accountbalance" value="0.00">
    </div>
   </div>
   <div class="col-md-2">
   <div class="form-group">
    <label class="form-label" for="phone-no">IMF CODE</label>
     <input type="text" class="form-control " id="imf" name="imf">
    </div>
   </div>
   <div class="col-md-2">
   <div class="form-group">
    <label class="form-label" for="phone-no">COT CODE</label>
     <input type="text" class="form-control" id="cot" name="cot">
    </div>
   </div>
    <div class="col-md-6">
   <div class="form-group">
    <label class="form-label" for="phone-no">2FA PIN</label>
     <input type="text" class="form-control" id="secretCode" name="secretCode" value="<?php echo randomNumber(4); ?>">
    </div>
   </div>
     <div class="col-md-6">
   <div class="form-group">
    <label class="form-label" for="phone-no">Password</label>
     <input type="text" class="form-control" id="password" name="password" value="<?php echo randomString(7); ?>">
    </div>
   </div>
     <div class="col-md-6">
   <div class="form-group">
    <label class="form-label" for="phone-no">Confirm Password</label>
     <input type="text" class="form-control" id="cpassword" name="cpassword" placeholder="Confirm password">
    </div>
   </div>
</div>
<div class="regResult"></div>
</div>
<div class="card-footer">
	<button type="submit" class="btn btn-primary regUser">Submit</button>
	<button type="reset" class="btn btn-danger ">Reset</button>
</div>	
</form>	
</div>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
 <script type="text/javascript">  
 //UPDATING USER DETAILS             	
 $(document).ready(function() {
 $('.regUser').on('click', function() {
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
    $('.regUser').click(function (e) {
      e.preventDefault();
      var firstname = $('#firstname').val();
      var middlename = $('#middlename').val();
      var lastname = $('#lastname').val();
      var countryId = $('#countryId').val();
      var stateId = $('#stateId').val();
      var cityId = $('#cityId').val();
      var zipcode = $('#zipcode').val();
      var dob = $('#dob').val();
      var address = $('#address').val();
      var phone = $('#phone').val();
      var email = $('#email').val();
      var accountnumber = $('#accountnumber').val();
      var accounttype = $('#accounttype').val();
      var usercurrency = $('#usercurrency').val();
      var accountbalance = $('#accountbalance').val();
      var imf = $('#imf').val();
      var cot = $('#cot').val();
      var secretCode = $('#secretCode').val();
      var password = $('#password').val();
      var cpassword = $('#cpassword').val();


      $.ajax
        ({
          type: "POST",
          url: "../scripts/register_account.php",
          data: {"firstname": firstname, "middlename": middlename, "lastname": lastname, "countryId": countryId, "stateId": stateId, "cityId": cityId, "zipcode": zipcode,
       "dob": dob, "address": address, "phone": phone, "email": email, "accountnumber": accountnumber, "accounttype": accounttype, "usercurrency": usercurrency,
       "accountbalance": accountbalance, "imf": imf, "cot": cot, "secretCode": secretCode, "password": password, "cpassword": cpassword
      },
          success: function (data) {
            $('.regResult').html(data);
            $('#form')[0].reset();
          }
        });
    });
  });
</script>
</div>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
      <script src="https://www.jqueryscript.net/demo/jQuery-International-Telephone-Input-With-Flags-Dial-Codes/build/js/intlTelInput.js"></script>
  <script>
       $("#phone").intlTelInput({
          

        });
       </script>
<?php
include("footer.php")
	?>