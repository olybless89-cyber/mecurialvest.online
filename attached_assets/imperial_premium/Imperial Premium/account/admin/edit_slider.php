<?php 
include("header.php");
$id = $_GET['id'];
$query = $conn->query("SELECT * FROM sliders WHERE id = '$id'");
while ($rows = mysqli_fetch_array($query)) {
	
?>

<div class="nk-content">
	<div class="container-xl wide-lg">
        <div class="nk-content-body">
        <div class="nk-block-head">
         <div class="nk-block-head-sub">
         </div>
           <div class="nk-block-between-md g-4 card-bordered">
             <div class="nk-block-head-content">
              <h4 class="nk-block-title fw-normal">Home page slider</h4>
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
	            <div class="card card-bordered card-preview">
                     <div class="card-header font-weight-bold text-light" style="background-color:#033d75;">
                       <h5 class="text-white"> <em class="icon ni ni-camera-fill"></em>Edit Slider</h5>
                    </div>
                    <div class="card-body">
                                   <form action="../scripts/update_slider.php" method="post" id="updateForm" class="gy-3" enctype="multipart/form-data">
                                   	<input type="hidden" name="id" value="<?php echo$id ?>">
                                                <div class="row g-3 align-center">
                                                    <div class="col-lg-5">
                                                        <div class="form-group">
                                                            <label class="form-label" for="site-name">Heading</label>
                                                            <span class="form-note">Specify the heading content of this slider</span>
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-7">
                                                        <div class="form-group">
                                                            <div class="form-control-wrap">
                                                                <input type="text" class="form-control" id="heading" value="<?php echo$rows['heading']?>" name="heading">
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                  <div class="row g-3 align-center">
                                                    <div class="col-lg-5">
                                                        <div class="form-group">
                                                            <label class="form-label">Button text</label>
                                                            <span class="form-note">Specify the buuton text  (eg. Learn more).</span>
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-7">
                                                        <div class="form-group">
                                                            <div class="form-control-wrap">
                                                                <input type="text" class="form-control" id="text" value="<?php echo$rows['text'] ?>" name="text">
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row g-3 align-center">
                                                    <div class="col-lg-5">
                                                        <div class="form-group">
                                                            <label class="form-label">Button link</label>
                                                            <span class="form-note">Specify the button link</span>
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-7">
                                                        <div class="form-group">
                                                            <div class="form-control-wrap">
                                                                <input type="text" class="form-control" id="link" value="<?php echo$rows['link'] ?>" name="link">
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                  <div class="row g-3 align-center">
                                                    <div class="col-lg-5">
                                                        <div class="form-group">
                                                            <label class="form-label">Content</label>
                                                           <span class="form-note">Specify the Body content of the slider.</span>
                                                     </div>
                                              </div>
                          <div class="col-lg-7">
                             <div class="form-group">
                               <div class="form-control-wrap">
                                  <textarea type="text" class="form-control" id="content" name="content"><?php echo$rows['content'] ?></textarea>
                                   </div>
                                 </div>
                               </div>
                             </div>
                               <div class="row g-3 align-center">
                                                    <div class="col-lg-5">
                                                        <div class="form-group">
                                                            <label class="form-label">Image</label>
                                                            <span class="form-note">Specify the slider Image(400 x 260).</span>
                                                       </div>
                                              </div>
                          <div class="col-lg-7">
                             <div class="form-group">
                               <div class="">
                               	<img src="../<?php echo$rows['picture'] ?>" class="p-1" width="406" id="output_image">
                                  <input type="file" class="form-control" id="picture" name="picture" accept="image/*" onchange="preview_image(event)">
                                   </div>
                                 </div>
                               </div>
                             </div>
                            <div class="row g-3">
                             <div class="col-lg-7 offset-lg-5">
                            <div id="updateResult"></div>
                             <div class="form-group mt-2">
                             <input type="submit" class="btn btn-lg btn-primary btn-block" value="Update">
                              </div>
                            </div>
                            </div>
                         </form>
                       </div>
                  </div> 
           </div>  
   <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
  <script type="text/javascript">
$(document).ready(function (e) {
	$("#updateForm").on('submit',(function(e) {
		e.preventDefault();
		$.ajax({
        	url: "../scripts/update_slider",
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
</script>
       <?php } ?>
<?php 
include("footer.php");
?>