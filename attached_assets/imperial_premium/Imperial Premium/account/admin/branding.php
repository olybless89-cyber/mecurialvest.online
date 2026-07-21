 <?php include("header.php"); ?>

 <div class="nk-content">
 <div class="container-xl wide-lg">
        <div class="nk-content-body">
        <div class="nk-block-head">
         <div class="nk-block-head-sub">
         </div>
           <div class="nk-block-between-md g-4 card-bordered">
             <div class="nk-block-head-content">
              <h4 class="nk-block-title fw-normal">Website Branding.</h4>
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
                  <div class="nk-block nk-block-lg">
                                    <div class="nk-block-head">
                                        <div class="nk-block-head-content">
                                            <h4 class="title nk-block-title">Logo & favicon configuration</h4>
                                            <div class="nk-block-des">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card card-bordered">
                                        <div class="card-inner">
                                            <div class="card-head">
                                                <h5 class="card-title">Logo Setting</h5>
                                            </div>
                                            <form action="../scripts/branding.php?action=logo" method="post" id="logoForm" class="gy-3" enctype="multipart/form-data">
                                                <div class="row g-3 align-center">
                                                    <div class="col-lg-5">
                                                        <div class="form-group">
                                                            <label class="form-label" for="site-name">Logo</label>
                                                            <span class="form-note">Specify the logo of your website</span>
                                                            <span class="form-note">Logo should have a transparent background (300 x 82) recommended.</span>
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-7">
                                                    	  <div id="mainLogo">
                                                    	  	<img src="../<?php echo $logo ?>" width="300" height="80">
                                                    	  </div>
                                                    	  <p></p>
                                                          <div class="form-control-wrap" style="max-width: 300px;">
                                                                <div class="custom-file">
                                                               <input type="file" class="custom-file-input" name="logo" accept="image/*" id="customFile">
                                                               <label class="custom-file-label" for="customFile">Choose file</label>
                                                                </div>
                                                          </div>
                                                        </div>
                                                    </div>
                                                <div class="row g-3">
                                                    <div class="col-lg-7 offset-lg-5">
                                                        <div id="logoResult"></div>
                                                        <div class="form-group mt-2">
                                                            <button type="submit" class="btn btn-lg btn-primary emailBtn">Update</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div><!-- card -->

                                    <div class="card card-bordered">
                                        <div class="card-inner">
                                            <div class="card-head">
                                                <h5 class="card-title">Footer Logo</h5>
                                            </div>
                                            <form action="../scripts/branding.php?action=footerlogo" method="post" id="footerLogoForm" class="gy-3" enctype="multipart/form-data">
                                                <div class="row g-3 align-center">
                                                    <div class="col-lg-5">
                                                        <div class="form-group">
                                                            <label class="form-label" for="site-name">Footer Logo</label>
                                                            <span class="form-note">Specify the logo That will apear at the footer of your website</span>
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-7">
                                                    	  <div id="mainLogo">
                                                    	  	<img src="../<?php echo $footerlogo ?>" width="300" height="80">
                                                    	  </div>
                                                    	  <p></p>
                                                          <div class="form-control-wrap" style="max-width: 300px;">
                                                                <div class="custom-file">
                                                               <input type="file" class="custom-file-input" name="footerlogo" accept="image/*" id="customFile">
                                                               <label class="custom-file-label" for="customFile">Choose file</label>
                                                                </div>
                                                          </div>
                                                        </div>
                                                    </div>
                                                <div class="row g-3">
                                                    <div class="col-lg-7 offset-lg-5">
                                                        <div id="footerlogoResult"></div>
                                                        <div class="form-group mt-2">
                                                            <button type="submit" class="btn btn-lg btn-primary">Update</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div><!-- card -->
                                    <!---Email Logo --------->
                                     <div class="card card-bordered">
                                        <div class="card-inner">
                                            <div class="card-head">
                                                <h5 class="card-title">Email header Logo</h5>
                                            </div>
                                            <form action="../scripts/branding.php?action=email" method="post" id="emailForm" class="gy-3" enctype="multipart/form-data">
                                                <div class="row g-3 align-center">
                                                    <div class="col-lg-5">
                                                        <div class="form-group">
                                                            <label class="form-label" for="site-name">Footer Logo</label>
                                                            <span class="form-note">Specify the logo That will apear at the header of every outgoing email sent through your website. Should have light color and transparent background</span>
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-7">
                                                    	  <div id="mainLogo">
                                                    	  	<img src="https://<?php echo $emaillogo ?>" width="300" height="80">
                                                    	  </div>
                                                    	  <p></p>
                                                          <div class="form-control-wrap" style="max-width: 300px;">
                                                                <div class="custom-file">
                                                               <input type="file" class="custom-file-input" name="emaillogo" accept="image/*" id="customFile">
                                                               <label class="custom-file-label" for="customFile">Choose file</label>
                                                                </div>
                                                          </div>
                                                        </div>
                                                    </div>
                                                <div class="row g-3">
                                                    <div class="col-lg-7 offset-lg-5">
                                                        <div id="emailResult"></div>
                                                        <div class="form-group mt-2">
                                                            <button type="submit" class="btn btn-lg btn-primary">Update</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div><!-- card -->
                                     <!---Email Logo --------->
                                     <div class="card card-bordered">
                                        <div class="card-inner">
                                            <div class="card-head">
                                                <h5 class="card-title">Favicon</h5>
                                            </div>
                                            <form action="../scripts/branding.php?action=favicon" method="post" id="faviconForm" class="gy-3" enctype="multipart/form-data">
                                                <div class="row g-3 align-center">
                                                    <div class="col-lg-5">
                                                        <div class="form-group">
                                                            <label class="form-label" for="site-name">Favicon</label>
                                                            <span class="form-note">Specify the favicon of your website. typically displayed in the address bar of a browser accessing the website or next to the website name in a user's list of bookmarks.</span>
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-7">
                                                    	  <div id="mainLogo">
                                                    	  	<img src="../images/<?php echo $favicon ?>" width="200" height="200">
                                                    	  </div>
                                                    	  <p></p>
                                                          <div class="form-control-wrap" style="max-width: 300px;">
                                                                <div class="custom-file">
                                                               <input type="file" class="custom-file-input" name="favicon" accept="image/*" id="customFile">
                                                               <label class="custom-file-label" for="customFile">Choose file</label>
                                                                </div>
                                                          </div>
                                                        </div>
                                                    </div>
                                                <div class="row g-3">
                                                    <div class="col-lg-7 offset-lg-5">
                                                        <div id="faviconResult"></div>
                                                        <div class="form-group mt-2">
                                                            <button type="submit" class="btn btn-lg btn-primary">Update</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div><!-- card -->
                                </div><!-- .nk-block -->
                            </div><!-- .components-preview -->
                        </div>
                    </div>
                   <script src="../js/jquery.min.js"></script>
         <script type="text/javascript">
$(document).ready(function (e) {
	$("#logoForm").on('submit',(function(e) {
		e.preventDefault();
		$.ajax({
        	url: "../scripts/branding.php?action=logo",
			type: "POST",
			data:  new FormData(this),
			contentType: false,
    	    cache: false,
			processData:false,
			success: function(data)
		    {
			$("#logoResult").html(data);
		    },
		  	error: function() 
	    	{
	    	} 	        
	   });
	}));
});

$(document).ready(function (e) {
	$("#footerLogoForm").on('submit',(function(e) {
		e.preventDefault();
		$.ajax({
        	url: "../scripts/branding.php?action=footerlogo",
			type: "POST",
			data:  new FormData(this),
			contentType: false,
    	    cache: false,
			processData:false,
			success: function(data)
		    {
			$("#footerlogoResult").html(data);
		    },
		  	error: function() 
	    	{
	    	} 	        
	   });
	}));
});
$(document).ready(function (e) {
	$("#emailForm").on('submit',(function(e) {
		e.preventDefault();
		$.ajax({
        	url: "../scripts/branding.php?action=email",
			type: "POST",
			data:  new FormData(this),
			contentType: false,
    	    cache: false,
			processData:false,
			success: function(data)
		    {
			$("#emailResult").html(data);
		    },
		  	error: function() 
	    	{
	    	} 	        
	   });
	}));
});
$(document).ready(function (e) {
	$("#faviconForm").on('submit',(function(e) {
		e.preventDefault();
		$.ajax({
        	url: "../scripts/branding.php?action=favicon",
			type: "POST",
			data:  new FormData(this),
			contentType: false,
    	    cache: false,
			processData:false,
			success: function(data)
		    {
			$("#faviconResult").html(data);
		    },
		  	error: function() 
	    	{
	    	} 	        
	   });
	}));
});
</script>
 <?php include("footer.php") ?>