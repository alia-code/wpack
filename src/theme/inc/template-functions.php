<?php
/**
 * Functions which enhance the theme by hooking into WordPress
 *
 * @package Underscores
 */

/**
 * Adds custom classes to the array of body classes.
 *
 * @param array $classes Classes for the body element.
 * @return array
 */
function underscores_body_classes( $classes ) {
	// Adds a class of hfeed to non-singular pages.
	if ( ! is_singular() ) {
		$classes[] = 'hfeed';
	}

	return $classes;
}
add_filter( 'body_class', 'underscores_body_classes' );


function admin_css() {
    wp_register_style( 'admin-stylesheet', get_template_directory_uri() . '/admin.css' );
    wp_enqueue_style( 'admin-stylesheet' );
}

add_action( 'admin_enqueue_scripts', 'admin_css' );

/**
 * Add a pingback url auto-discovery header for singularly identifiable articles.
 */
function underscores_pingback_header() {
	if ( is_singular() && pings_open() ) {
		echo '<link rel="pingback" href="', esc_url( get_bloginfo( 'pingback_url' ) ), '">';
	}
}
add_action( 'wp_head', 'underscores_pingback_header' );
