<?php
	require_once 'detection/Mobile_Detect.php';
	$detect = new Mobile_Detect;
	
	require_once 'detection/Browser_Detect.php';
	$ua=getBrowser();
	$yourbrowser= "Your browser: " . $ua['name'] . " " . $ua['version'] . " on " .$ua['platform'] . " reports: <br >" . $ua['userAgent'];
?>
<!DOCTYPE html>
<!--[if IE 7]>
<html class="ie ie7" <?php language_attributes(); ?>>
<![endif]-->
<!--[if IE 8]>
<html class="ie ie8" <?php language_attributes(); ?>>
<![endif]-->
<!--[if !(IE 7) | !(IE 8)  ]><!-->
<html <?php language_attributes(); ?> class="<?echo $ua['name'];?><?if($ua['name']=='IE')echo ' '.$ua['name'].$ua['version'];?><?if($detect->isMobile()):if(strpos($ua['userAgent'],'CriOS')):?> mobileChrome<?else:?> mobileSafari<?endif;endif;?>">
<!--<![endif]-->
	<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>" />
	<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0, user-scalable=no">
	<title><?php wp_title( '|', true, 'right' ); ?></title>
	<base href="<?$directory=get_template_directory_uri(); echo $directory; ?>/" />
	<meta name="description" content="">
	<link rel="shortcut icon" href="/images/favicon.ico">
	<!-- <meta property="og:type" content="activity" />
	<meta property="og:title" content="<?php echo bloginfo('name'); ?>"/>
	<meta property="og:image" content=""/>
	<meta property="og:site_name" content="<?php echo bloginfo('name'); ?>"/>
	<meta property="og:description" content=""/> -->
	<?
	wp_enqueue_style('style', get_template_directory_uri().'/css/style.min.css', array(), null, 'all');
	// wp_enqueue_script( 'jquery.min' , get_template_directory_uri() . '/js/plugin/jquery.min.js' );
	?>
	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
	<div class="body_wrap">


		
		<?php wp_reset_query(); ?>