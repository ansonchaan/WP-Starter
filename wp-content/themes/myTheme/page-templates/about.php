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
		<a class="page" href="<?php echo home_url('/'); ?>">home</a>
		<br/>
		<?php the_content(); ?>
	</main>

<?php get_footer(); ?>