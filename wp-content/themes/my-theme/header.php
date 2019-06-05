<?php
	global $mobileDetect;
	global $ua;
	$yourbrowser= "Your browser: " . $ua['name'] . " " . $ua['version'] . " on " .$ua['platform'] . " reports: <br >" . $ua['userAgent'];
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?> class="<?echo $ua['name'];?><?if($ua['name']=='IE')echo ' '.$ua['name'].$ua['version'];?><?if($mobileDetect->isMobile):if(strpos($ua['userAgent'],'CriOS')):?> mobileChrome<?else:?> mobileSafari<?endif;endif;?>">
	<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>" />
	<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0, user-scalable=no">
	<title><?php wp_title( '|', true, 'right' ); ?></title>
	<base href="<?$directory=get_template_directory_uri(); echo $directory; ?>/" />
	<link rel="shortcut icon" href="/images/favicon.ico">

	<!-- Search Engine -->
<!-- 
	<meta name="description" content="xxx"> 
	<meta name="image" content="text"> -->

	<!-- Schema.org for Google -->
<!-- 
	<meta itemprop="name" content="xxx">
	<meta itemprop="description" content="xxx"> 
	<meta itemprop="image" content="text"> -->

	<!-- Twitter -->
<!-- 
	<meta name="twitter:card" content="summary">
	<meta name="twitter:title" content="<?php echo bloginfo('name'); ?>">
	<meta name="twitter:description" content="xxx">
	<meta name="twitter:image:src" content="xxx"> -->

	<!-- Open Graph general (Facebook, Pinterest & Google+) -->
<!-- 
	<meta property="og:url" content="<?php echo site_url('/'); ?>">
	<meta property="og:title" content="<?php echo bloginfo('property'); ?>"/>
	<meta property="og:site_property" content="<?php echo bloginfo('property'); ?>"/>
	<meta property="og:description" content="xxx"/>
	<meta property="og:image" content="xxx"/>
	<meta property="og:locale" content="zh_HK">
	<meta property="og:type" content="<?php if(is_single())echo'article';else echo'website'; ?>" /> -->

	<!-- Open Graph - Article -->
<!-- 
	<meta name="article:section" content="section">
	<meta name="article:published_time" content="2016-10-10T19:08:47+01:00">
	<meta name="article:author" content="author">
	<meta name="article:tag" content="tag"> -->
	
	<?
	wp_enqueue_style('style', get_template_directory_uri().'/css/style.min.css', array(), null, 'all');
	?>
	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
	<div id="body_wrap">
		<div id="scroll">
<?php wp_reset_query(); ?>