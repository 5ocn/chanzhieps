<div class="modal-dialog" style="width:500px;">
  <div class="modal-content">
    <div class="modal-header">
      <?php echo html::closeButton();?>
      <h4 class="modal-title"><i class="icon-key"></i> <?php echo $lang->user->changePassword;?></h4>
    </div>
    <div class="modal-body">
      <form method='post' action='<?php echo inlink('changepassword');?>' id='passwordForm' class='form'>
        <table class='table table-form' style="border:none;">
          <tr>
            <th class="col-xs-4"><?php echo $lang->user->account;?></th>
            <td class="col-xs-6"><?php echo $user->account;?></td><td></td>
          </tr>  
          <tr>
            <th><?php echo $lang->user->newPassword;?></th>
            <td><?php echo html::password('password1', '', "class='form-control'");?></td><td></td>
          </tr>  
          <tr>
            <th><?php echo $lang->user->password2;?></th>
            <td><?php echo html::password('password2', '', "class='form-control'");?></td><td></td>
          </tr>  
          <tr><td></td><td><?php echo html::submitButton();?></td></tr>
        </table>
      </form>
    </div>
  </div><!-- /.modal-content -->
</div><!-- /.modal-dialog -->
<?php if(isset($pageJS)) js::execute($pageJS);?>
