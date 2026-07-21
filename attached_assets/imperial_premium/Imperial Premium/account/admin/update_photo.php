<?php 
include("header.php");
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
              <h4 class="nk-block-title fw-normal">Update Profile Image  (<?php echo$fullname ?>).</h4>
                <div class="nk-block-des">
                  <p>
                   </p>
                      </div>
                       </div>
                            <div class="nk-block-head-content">
                                        <ul class="nk-block-tools gx-3">
                                            <li><a onclick="window.history.go(-1);" class="btn btn-primary"><span>Back</span> <em class="icon ni ni-arrow-left"></em></a></li>
                                        </ul>
                                    </div><!-- .nk-block-head-content -->
                                </div><!-- .nk-block-between -->
                            </div><!-- .nk-block-head -->
                        </div>
                    </div>

                 <div class="card card-bordered p-0">
          <div class="card-header font-weight-bold text-light" style="background-color:#033d75;">
          	<h5 class="text-white">Passport Upload</h5>
        </div>

        <div class="card-body">
        	<?php
        	if(isset($_POST['update'])){
$target_dir = "../auth/passport/";
$target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);
$uploadOk = 1;
$imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));

// Check if image file is a actual image or fake image
if(isset($_POST["submit"])) {
  $check = getimagesize($_FILES["fileToUpload"]["tmp_name"]);
  if($check !== false) {
    $uploadOk = 1;
  } else {
    echo "<div class='alert alert-danger'>Invalid file type</div>";
    $uploadOk = 0;
  }
}

// Check file size
if ($_FILES["fileToUpload"]["size"] > 500000) {
  echo "<div class='alert alert-danger'>Sorry, your file is too large</div>";
  $uploadOk = 0;
}

// Allow certain file formats
if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
&& $imageFileType != "gif" ) {
  echo "<div class='alert alert-danger'>Sorry, only JPG, JPEG, PNG & GIF files are allowed.</div>";
  $uploadOk = 0;
}

// Check if $uploadOk is set to 0 by an error
if ($uploadOk == 0) {
// if everything is ok, try to upload file
} else {
  $newname = "".substr($sitename, 0,3)."IMG".date("YmdHi")."-".randomString(5).".";  
  $newname =strtoupper($newname);
  $target_file = "$target_dir$newname$imageFileType";
  if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
    $passport =  "$newname$imageFileType";
    $query = $conn->query("UPDATE users SET passport = '$passport' WHERE id = '$id' ");
    echo "<div class='alert alert-success'>passport have been uploaded.</div>";
  } else {
    echo "<div class='alert alert-danger'>Sorry, there was an error uploading your file.</div>";
  }
}
}
?>
           <div class="row">
             <?php
              if($passport == ""){
              	$link = "../auth/passport/avatar-empty-7890.png";
              }else{
              	$link = "../auth/passport/$passport";
              }
              ?>    
              <div class="container p-2">
              	<img src="<?php echo$link ?>" class="round" height="200" width="150" id="output_image">
           </div>
            <div class="form-control-wrap">
             <div class="custom-file">
             	<form action="" method="post" class="buysell-form" enctype="multipart/form-data"> 
            <input type="file" class="custom-file-input" name="fileToUpload" id="fileToUpload" accept="image/*" onchange="preview_image(event)">
            <label class="custom-file-label" for="customFile">Choose file</label>
        </div>
    </div>
</div>
<script type='text/javascript'>
function preview_image(event) 
{
 var reader = new FileReader();
 reader.onload = function()
 {
  var output = document.getElementById('output_image');
  output.src = reader.result;
 }
 reader.readAsDataURL(event.target.files[0]);
}
function preview_imageB(event) 
{
 var reader = new FileReader();
 reader.onload = function()
 {
  var output = document.getElementById('output_imageB');
  output.src = reader.result;
 }
 reader.readAsDataURL(event.target.files[0]);
}
</script>
       </div>
         <div class="card-footer">
           	<button type="submit" name="update" class="btn btn-lg btn-primary userUpdate">Update</button>
           </div>
     </div>
</form>
    </div>    


<?php 
include("footer.php");

?>