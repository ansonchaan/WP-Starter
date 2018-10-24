<?php
/**
 * The template for displaying the footer
 *
 * Contains footer content and the closing of the #main and #page div elements.
 *
 * @package WordPress
 * @subpackage Twenty_Twelve
 * @since Twenty Twelve 1.0
 */
$ua=getBrowser();
?>
			</div><!-- end of #scroll -->
		<?php 
		if( $ua['name'] == 'IE' )
			wp_enqueue_script( 'flickity' ,'https://npmcdn.com/flickity@1.2.1/dist/flickity.pkgd.js');
		wp_enqueue_script( 'all.js' , get_template_directory_uri() . '/js/all.min.js' );

		wp_footer(); ?>
	</body>
</html>