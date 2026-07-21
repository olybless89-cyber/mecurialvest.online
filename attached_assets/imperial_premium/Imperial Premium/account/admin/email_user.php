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
              <h4 class="nk-block-title fw-normal">Send email to a user.</h4>
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

                          <div class="card card-preview card-bordered">
                           <div class="card-header font-weight-bold text-light" style="background-color:#033d75;">
                           	<h5 class="text-white"><em class="icon ni ni-chat-fill"></em> Send email to a user</h5>
                           </div>
                           <form action="../scripts/email_user" id="sendForm" method="post">
                           <div class="card-body">
                              <div class="form-control-group p-2">
                                <?php if(empty($_GET['email'])){ ?>
                                  <input list="emails" type="text" class="form-control form-control-lg form-control-outlined" name="email" id="email">
                                           <datalist id="emails">
                                                  <?php  
                                                  $query = $conn->query("SELECT * FROM users WHERE id != 1 ORDER BY id DESC");
                                                  while ($rows = mysqli_fetch_array($query)) {
                                                    echo "<option value='".$rows['email']."'>".$rows['firstname']."  ".$rows['lastname']." ".$rows['middlename']."</option>";
                                                    }
                                                   ?>
                                                </datalist>
                                              <?php  } else{ ?>
                                              <input readonly="" value="<?php echo$_GET['email']?>" type="text"  class="form-control form-control" id="email" name="email">
                                              <?php } ?>
                                                <div class="form-dropdown">
                                                    <div class="text">Account<span></span></div>
                                                </div>
                                       </div>
                                      <div class="form-control-group p-2">
                                                <input type="text"  class="form-control form-control" id="subject" name="subject">
                                                <div class="form-dropdown">
                                                    <div class="text">Subject<span></span></div>
                                                </div>
                                       </div>
                                     <div class="form-control-wrap p-2">
                                     	<textarea class="form-control nicEdit" id="" name="message" placeholder="Message"></textarea>
                                     </div>  
                           </div>
                           <div id="emailResult"></div>
                           <div class="card-footer">
                            <button class="btn btn-primary emailBtn" type="submit">Send Email</button>
                              <button class="btn btn-danger" type="reset">Reset</button>
                            </form>
                           </div>
                           </div>
                          </div>
                     </div>
                      <script src="../assets/js/nicEdit.js"></script>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
  <script type="text/javascript">
 $( document ).ready(function() {
        "use strict";
        bkLib.onDomLoaded(function() {
            $( ".nicEdit" ).each(function( index ) {
                $(this).attr("id","nicEditor"+index);
                new nicEditor({fullPanel : true}).panelInstance('nicEditor'+index,{hasPanel : true});
            });
        });
    });
</script>
 <script type="text/javascript">       	
 $(document).ready(function() {
 $('.emailBtn').on('click', function() {
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
 });
 //Submit Form

 $(document).ready(function (e) {
    $("#sendForm").on('submit',(function(e) {
        e.preventDefault();
        $.ajax({

            url: "../scripts/email_user",
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
 var editor = CKEDITOR.replace( 'message' );
 CKEDITOR.instances.editor1.updateElement();
alert( document.getElementById( 'message' ).value );

// The "change" event is fired whenever a change is made in the editor.
editor.on( 'change', function( evt ) {
    // getData() returns CKEditor's HTML content.
    console.log( 'Total bytes: ' + evt.editor.getData().length );
});

  </script>
<?php 
include("footer.php");
?>