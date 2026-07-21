<?php include("header.php"); ?>

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
<div class="nk-content">

 <div class="container-xl wide-lg">
        <div class="nk-content-body">
        <div class="nk-block-head">
         <div class="nk-block-head-sub">
         </div>
           <div class="nk-block-between-md g-4 card-bordered">
             <div class="nk-block-head-content">
              <h4 class="nk-block-title fw-normal">Reset User password. (<?php echo$fullname ?>)</h4>
                <div class="nk-block-des">
                  <p>
                   </p>
                      </div>
                       </div>
                            <div class="nk-block-head-content">
                                        <ul class="nk-block-tools gx-3">
                                            <li><a onclick="window.history.go(-1);" class="btn btn-primary"><span>Back</span> <em class="icon ni ni-arrow-left"></em></a></li>
                                            <li><a href="fund_user" class="btn btn-success"><span>Fund an account</span> <em class="icon ni ni-invest"></em></a></li>
                                        </ul>
                                    </div><!-- .nk-block-head-content -->
                                </div><!-- .nk-block-between -->
                            </div><!-- .nk-block-head -->
                        </div>
                    </div>
                    <div class="card card-preview card-bordered p-0">
                      <div class="card-header font-weight-bold text-light" style="background-color:#033d75;">
                      <h5 class="text-white"><em class="icon ni ni-shield-star"></em> Update User password</h5>
                      </div>
                      <form action="" method="post">
                      <div class="card-body">
                        <div class="form-group row">
                            <div class="form-control-wrap col-lg-12 p-2">
                                 <input type="text" name="password" class="form-control" id="password" placeholder="new password">
                            </div>
                             <div class="form-control-wrap col-lg-12 p-2">
                                 <input type="text" name="cpassword" placeholder="confirm password" class="form-control" id="cpassword">
                            </div>
                            <input type="hidden" name="id" value="<?php echo$id ?>" id="id">
                        </div>
                        <div class="passwordResult"></div>
                        <div class="card-footer">
                                <button class="btn btn-primary updateBtn" type="submit">Update</button>
                                <button class="btn btn-danger" type="reset">Reset</button>
                            </div>
                        </form>
                      </div>
                    </div>
                 </div>
                 <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
 <script type="text/javascript">                
 $(document).ready(function() {
 $('.updateBtn').on('click', function() {
 var $this = $(this);
 var loadingText = '<i class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></i>&nbsp;Processing...';
 if ($(this).html() !== loadingText) {
 $this.data('original-text', $(this).html());
 $this.html(loadingText);
 }
 setTimeout(function() {
 $this.html($this.data('original-text'));
 },2000);
 });
 })
$(document).ready(function () {
    $('.updateBtn').click(function (e) {
      e.preventDefault();
      var password = $('#password').val();
      var cpassword = $('#cpassword').val();
      var id = $('#id').val();
      $.ajax
        ({
          type: "POST",
          url: "../scripts/user_password_reset",
          data: {"password": password, "cpassword": cpassword, "id": id},
          success: function (data) {
            $('.passwordResult').html(data);
            $('#form')[0].reset();
          }
        });
    });
  });
  </script>
                    <?php include("footer.php"); ?>