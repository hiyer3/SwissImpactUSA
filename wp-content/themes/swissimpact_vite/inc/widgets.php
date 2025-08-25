<?php
/**
 * Register our sidebars and widgetized areas.
 *
 */
function footer_widget_init() {

    register_sidebar( array(
		'name'          => 'Footer Widget 1',
		'id'            => 'footer_widget_1',
		'before_widget' => '<div>',
		'after_widget'  => '</div>',
		'before_title'  => '<h2 class="rounded">',
		'after_title'   => '</h2>',
	) );

    register_sidebar( array(
		'name'          => 'Footer Widget 2',
		'id'            => 'footer_widget_2',
		'before_widget' => '<div>',
		'after_widget'  => '</div>',
		'before_title'  => '<h2 class="rounded">',
		'after_title'   => '</h2>',
	) );

	register_sidebar( array(
		'name'          => 'Footer Widget 3',
		'id'            => 'footer_widget_3',
		'before_widget' => '<div>',
		'after_widget'  => '</div>',
		'before_title'  => '<h2 class="rounded">',
		'after_title'   => '</h2>',
	) );

}
add_action( 'widgets_init', 'footer_widget_init' );

?>