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
			<div id="home">
				<a class="page" href="<?php echo home_url('/'); ?>">home</a>
				<a class="page" href="<?php echo home_url('/about/'); ?>">about</a>
				<br/>
				This is home page
				<br/><br/>
				<div style="width:300px;height:198px" data-src="https://hkipf.org.hk/wp-content/uploads/2018/10/Provoke-01.jpg"></div>
				<div style="width:300px;height:198px" data-src="https://hkipf.org.hk/wp-content/uploads/2018/09/TimeSpace-01.jpg"></div>
				<div id="featured_about" style="height: 200vh;"></div>
				<img src="" data-src="https://hkipf.org.hk/wp-content/uploads/2018/09/Nakahira-Takuma-01.jpg"/>
				<div style="height: 200vh;">123</div>
				<img src="" data-src="https://hkipf.org.hk/wp-content/uploads/2018/09/BW-Nostalgia-01.jpg"/>
			</div>
		</div>
	</main>
	
<?php get_footer(); ?>