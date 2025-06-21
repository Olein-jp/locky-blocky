<?php
/**
 * Plugin Name: Locky Blocky
 * Description: Toggle the WordPress block templateLock (contentOnly) from the block toolbar with ease.
 * Version: 1.0.0
 * Author: Koji Kuno
 * License: GPL-2.0+
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: locky-blocky
 */

defined( 'ABSPATH' ) || exit;

/**
 * Enqueue block editor script for administrators only.
 *
 * @since 1.0.0
 */
function locky_blocky_controller_enqueue_assets() {
	// Only load script for administrators.
	if ( current_user_can( 'administrator' ) ) {
		wp_enqueue_script(
			'locky-blocky-controller',
			plugins_url( 'build/index.js', __FILE__ ),
			array( 'wp-blocks', 'wp-element', 'wp-edit-post', 'wp-plugins', 'wp-components', 'wp-i18n' ),
			filemtime( plugin_dir_path( __FILE__ ) . 'build/index.js' )
		);
	}
}
add_action( 'enqueue_block_editor_assets', 'locky_blocky_controller_enqueue_assets' );