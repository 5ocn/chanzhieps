<?php include '../../common/view/header.html.php';?>
<div class='row'>
  <?php include './side.html.php';?>
  <div class='col-md-10'>
    <form id='ajaxForm' method='post' target='hiddenwin' action="<?php echo $this->createLink('message', 'batchDelete');?>">
      <div class='panel'>
        <div class='panel-heading'><strong><i class='icon-comments-alt'></i> <?php echo $lang->user->messages;?></strong></div>
        <table class='table table-bordered table-hover' id='messages'>
          <thead>
            <tr class='text-center'>
              <th style='width: 10px'><input type='checkbox' id='selectAll'></th>
              <th style='width: 50px'><?php echo $lang->message->from;?></th>
              <th style='width: 150px'><?php echo $lang->message->date;?></th>
              <th><?php echo $lang->message->content;?></th>
              <th style='width: 60px'><?php echo $lang->message->readed;?></th>
              <th style='width: 80px'><?php echo $lang->actions;?></th>
            </tr>
          </thead>
          <?php foreach($messages as $message):?>
          <tr class='text-center'>
            <td><input type='checkbox' name='messages[]' value="<?php echo $message->id?>" /></td>
            <td><?php echo $message->from;?></td>
            <td><?php echo substr($message->date, 5);?></td>
            <td class='text-left'><?php echo $message->content;?></td>
            <td><?php echo $lang->message->readedStatus[$message->readed];?></td>
            <?php if(!$message->readed):?>
            <td><?php echo html::a($this->createLink('message', 'view', "message=$message->id"), $message->link ? $lang->message->view : $lang->message->readed);?></td>
            <?php else:?>
            <td><?php echo $lang->message->readed;?></td>
            <?php endif;?>
          </tr>
          <?php endforeach;?>
          <tr>
            <td colspan='6'>
              <?php
              if($messages) echo html::submitButton($lang->message->deleteSelected);
              $pager->show();
              ?>
            </td>
          </tr>
        </table>
      </div>
    </form>
  </div>
</div>
<?php include '../../common/view/footer.html.php';?>
