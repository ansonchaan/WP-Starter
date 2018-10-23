<?php
/**
 * The main template file
 *
 * This is the most generic template file in a WordPress theme
 * and one of the two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query.
 * For example, it puts together the home page when no home.php file exists.
 *
 * @link http://codex.wordpress.org/Template_Hierarchy
 *
 * @package WordPress
 * @subpackage Twenty_Twelve
 * @since Twenty Twelve 1.0
 */

get_header(); ?>

	<main>
		<div id="mainWrap">
			<a class="page" href="<?php echo home_url('/'); ?>">home</a>
			<a class="page" href="<?php echo home_url('/about/'); ?>">about</a>
			<br/>
			This is home page
			<br/><br/>
			<div id="featured_about" style="height: 200vh;"></div>
		</div>
	</main>
	
<?php get_footer(); ?>