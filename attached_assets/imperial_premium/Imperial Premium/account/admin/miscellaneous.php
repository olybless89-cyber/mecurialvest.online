<?php 
include("header.php");
?>
<div class="nk-content">
	<?php if(empty($_GET['action'])) { ?>
	 <div class="card card-bordered card-preview">
                     <div class="card-header font-weight-bold text-light" style="background-color:#033d75;">
                       <h5 class="text-white"> <em class="icon ni ni-moon"></em> Upload account Details</h5>
                    </div>
                    <div class="card-body">
                    	<strong>Bank details that was uploaded here will authomatically pop up when a user is adding a recipient for international Transfer. The criterion is user supplying an account number that matched with the already uploaded records. Therefore, if they failed to input an account number that matched with any record, input fields will prompt out for them to fill it manually.</strong>
                       <hr>
                       <strong>Fill all details correctly</strong>
                       	<form action="../scripts/upload_bank.php" id="uploadForm">
                       		<div class="row card-bordered p-1" style="border-radius: 5px;">
                       		<div class="form-group col-lg-6">
                       			<div class="form-control-wrap">
                       				<input type="text" name="accountnumber" placeholder="Account Number" class="form-control">
                       			</div>
                       		</div>
                       		<div class="form-group col-lg-6">
                       			<div class="form-control-wrap">
                       				<input type="text" name="bankname" placeholder="Bank Name" class="form-control">
                       			</div>
                       		</div>
                       		<div class="form-group col-lg-6">
                       			<div class="form-control-wrap">
                       				<input type="text" placeholder="Account holder's name" name="accountname" class="form-control">
                       			</div>
                       		</div>
                       		<div class="form-group col-lg-6">
                       			<div class="form-control-wrap">
                       				<input type="text" placeholder="Bank Branch Address" name="bankbranch" class="form-control">
                       			</div>
                       		</div>
                       		<div class="form-group col-lg-12">
                       			<div class="form-control-wrap">
                       				<input type="text" placeholder="Account type"  name="accounttype" class="form-control">
                       			</div>
                       		</div>
                       		<div id="uploadResult"></div>
                       		<div class="form-group col-lg-6">
                       			<button class="btn btn-primary"  type="submit">Submit</button>
                       		</div>
                       		</div>
                       	</form>
                       
                       <p><strong id="details">Uploaded account Details</strong></p>
                      <table class="datatable-init table">
                  <thead>
                    <tr>
                     <th>Account number</th>
                       <th>Bank name</th>
                      <th>Account name</th>
                      <th>bank Branch Address</th>
                    <th>Account Type</th>
                    <th>Action</th>
                  </tr>
                </thead>
                 <tbody>
                    <?php 
                    $query = $conn->query("SELECT * FROM getbank ORDER BY id ASC");
                     while ($rows = mysqli_fetch_array($query)) {
                                          ?>
                    <tr>
                      <td><?php echo$rows['accountnumber']; ?></td>    
                      <td><?php echo$rows['bankname']; ?></td>  
                      <td><?php echo$rows['accountname'] ?></td>
                      <td><?php echo$rows['bankbranch']
                       ?></td>
                       <td><?php echo$rows['accounttype']
                       ?></td>
                      <td><a class="btn btn-primary btn-sm" href="miscellaneous?action=edit&id=<?php echo$rows['id'] ?>"><em class="icon ni ni-edit"></em> Edit</a>
                      </td>
                      </tr> 
                  <?php } ?>
              </tbody>
          </table>
      </div>
  </div>
<?php } else{ $id = $_GET['id'];
$query = $conn->query("SELECT * FROM getbank WHERE id = '$id'");
$rows = mysqli_fetch_array($query);
?>

 <div class="card card-bordered card-preview">
                     <div class="card-header font-weight-bold text-light" style="background-color:#033d75;">
                       <h5 class="text-white"> <em class="icon ni ni-moon"></em> Update Account Details</h5>
                    </div>
                    <div class="card-body">
                       <hr>
                       <strong>Fill all details correctly</strong>
                       	<form action="../scripts/update_bank.php" id="updateForm">
                       		<div class="row card-bordered p-1" style="border-radius: 5px;">
                       		<div class="form-group col-lg-6">
                       			<div class="form-control-wrap">
                       				<input type="text" name="accountnumber" value="<?php echo$rows['accountnumber'] ?>" placeholder="Account Number" class="form-control">
                       			</div>
                       		</div>
                       		<div class="form-group col-lg-6">
                       			<div class="form-control-wrap">
                       				<input type="text" name="bankname" placeholder="Bank Name" value="<?php echo$rows['bankname'] ?>" class="form-control">
                       			</div>
                       		</div>
                       		<div class="form-group col-lg-6">
                       			<div class="form-control-wrap">
                       				<input type="text" placeholder="Account holder's name" value="<?php echo$rows['accountname'] ?>" name="accountname" class="form-control">
                       			</div>
                       		</div>
                       		<input type="hidden" name="id" value="<?php echo$rows['id'] ?>">
                       		<div class="form-group col-lg-6">
                       			<div class="form-control-wrap">
                       				<input type="text" placeholder="Bank Branch Address" value="<?php echo$rows['bankbranch'] ?>" name="bankbranch" class="form-control">
                       			</div>
                       		</div>
                       		<div class="form-group col-lg-12">
                       			<div class="form-control-wrap">
                       				<input type="text" placeholder="Account type" value="<?php echo$rows['accounttype'] ?>"  name="accounttype" class="form-control">
                       			</div>
                       		</div>
                       		<div id="updateResult"></div>
                       		<div class="form-group col-lg-6">
                       			<button class="btn btn-primary"  type="submit">Update</button>
                       		</div>
                       		</div>
                       	</form>
            </div>
       </div>

<?php } ?>
</div>
   <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
  <script type="text/javascript">
$(document).ready(function (e) {
	$("#uploadForm").on('submit',(function(e) {
		e.preventDefault();
		$.ajax({
        	url: "../scripts/upload_bank",
			type: "POST",
			data:  new FormData(this),
			contentType: false,
    	    cache: false,
			processData:false,
			success: function(data)
		    {
			$("#uploadResult").html(data);
		    },
		  	error: function() 
	    	{
	    	} 	        
	   });
	}));
});

$(document).ready(function (e) {
	$("#updateForm").on('submit',(function(e) {
		e.preventDefault();
		$.ajax({
        	url: "../scripts/update_bank",
			type: "POST",
			data:  new FormData(this),
			contentType: false,
    	    cache: false,
			processData:false,
			success: function(data)
		    {
			$("#updateResult").html(data);
		    },
		  	error: function() 
	    	{
	    	} 	        
	   });
	}));
});
</script>
<?php include("footer.php"); ?>