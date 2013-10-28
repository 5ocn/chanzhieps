<?php
/**
 * The sitemap view file of chanzhiEPS.
 *
 * @copyright   Copyright 2013-2013 青岛息壤网络信息有限公司 (QingDao XiRang Network Infomation Co,LTD www.xirangit.com)
 * @license     LGPL
 * @author      Tingting Dai <daitingting@xirangit.com>
 * @package     sitemap
 * @version     $Id$
 * @link        http://www.chanzhi.org
 */
?>

<?php include '../../common/view/header.html.php';?>
<div class='box radius'>
  <h4 class='title'><?php echo $lang->sitemap->common;?></h4>
  <div class='content'>
    <?php if(strpos($productTree, '<li>') !== false):?>
    <div class='row'> 
      <h4><?php echo $lang->sitemap->productCategory?></h4>
      <?php echo $productTree?>
    </div>
    <?php endif;?>
    <?php if(strpos($articleTree, '<li>') !== false):?>
    <div class='row'> 
      <h4><?php echo $lang->sitemap->articleCategory?></h4>
      <?php echo $articleTree?>
    </div>
    <?php endif;?>
    <?php if(strpos($blogTree, '<li>') !== false):?>
    <div class='row'> 
      <h4><?php echo $lang->sitemap->blogCategory?></h4>
      <?php echo $blogTree?>
    </div>
    <?php endif;?>
  </div>
</div>
<?php include '../../common/view/footer.html.php';?>