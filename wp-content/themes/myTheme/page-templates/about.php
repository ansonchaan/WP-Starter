<?php
/**
 * Template Name: About Template
 *
 * Description: A page template that provides a key component of WordPress as a CMS
 * by meeting the need for a carefully crafted introductory page. The front page template
 * in Twenty Twelve consists of a page content area for adding text, images, video --
 * anything you'd like -- followed by front-page-only widgets in one or two columns.
 *
 * @package WordPress
 * @subpackage Twenty_Twelve
 * @since Twenty Twelve 1.0
 */

get_header(); ?>

	<main>
		<div id="main_wrap">
			<a class="page" href="<?php echo home_url('/'); ?>">home</a>
			<a class="page" href="<?php echo home_url('/about/'); ?>">about</a>
			<br/>
			This is about page
			<br/><br/>
			<div>about content 01.</div>
			<div id="content">about content 02.</div>
		</div>
	</main>

<?php get_footer(); ?>