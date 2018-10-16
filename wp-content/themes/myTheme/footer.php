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

		</div><!-- .body_wrapper -->
		<?php 
		if( $ua['name'] == 'IE' )
			wp_enqueue_script( 'flickity' ,'https://npmcdn.com/flickity@1.2.1/dist/flickity.pkgd.js');
		else
		wp_enqueue_script( 'flickity' , get_template_directory_uri() . '/js/lib/flickity.pkgd.min.js' );
		wp_enqueue_script( 'TweenMax' , get_template_directory_uri() . '/js/lib/TweenMax.min.js' );
		wp_enqueue_script( 'DrawSVGPlugin' , get_template_directory_uri() . '/js/lib/DrawSVGPlugin.min.js' );
		wp_enqueue_script( 'mobileDetect' , get_template_directory_uri() . '/js/lib/mobile-detect.min.js' );
		wp_enqueue_script( 'pure-js.js' , get_template_directory_uri() . '/js/lib/pure-js-function.js' );
		wp_enqueue_script( 'es6-promise-auto' , get_template_directory_uri() . '/js/lib/es6-promise.auto.min.js');
		wp_enqueue_script( 'axios' , get_template_directory_uri() . '/js/lib/axios.min.js' );
		// wp_enqueue_script( 'VirtualScroll' , get_template_directory_uri() . '/js/lib/virtualScroll.js' );
		wp_enqueue_script( 'common.js' , get_template_directory_uri() . '/js/common.js' );
		wp_footer(); ?>
	</body>
</html>