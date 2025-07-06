<?php
/**
 * Plugin Name: Locky Blocky
 * Description: Easily toggle the block template lock (contentOnly) in the WordPress block editor toolbar.
 * Requires at least: 6.8
 * Requires PHP: 7.4
 * Version: 1.0.3
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
// 管理者のみから、フックで権限を変更可能に
function locky_blocky_controller_enqueue_assets() {
	$capability = apply_filters( 'locky_blocky_required_capability', 'administrator' );
	if ( current_user_can( $capability ) ) {
		wp_enqueue_script(
			'locky-blocky-controller',
			plugins_url( 'build/index.js', __FILE__ ),
			array( 'wp-blocks', 'wp-element', 'wp-edit-post', 'wp-plugins', 'wp-components', 'wp-i18n' ),
			filemtime( plugin_dir_path( __FILE__ ) . 'build/index.js' )
		);
	}
}
add_action( 'enqueue_block_editor_assets', 'locky_blocky_controller_enqueue_assets' );