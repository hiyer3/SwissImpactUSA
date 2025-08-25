<?php
$wpsm_no_of_designs = 20;

?>

<div style=" overflow: hidden;padding: 10px;">
	<style>
		.html_editor_button {
			border-radius: 0px;
			background-color: #9C9C9C;
			border-color: #9C9C9C;
			margin-bottom: 20px;
		}

		.wpsm_site_sidebar_widget_title {
			display: block;
			background: #D8D8D8 none repeat scroll 0 0;
			color: #ffffff;
			overflow: hidden;
			margin-bottom: 40px;
		}

		.wpsm_site_sidebar_widget_title {
			display: block;
			background: #D8D8D8 none repeat scroll 0 0;
			color: #ffffff;
			overflow: hidden;
			margin-bottom: 40px;
		}

		.wpsm_site_sidebar_widget_title h4 {
			background: #FF1A00 none repeat scroll 0 0 !important;
			display: inline-block !important;
			padding: 0 20px !important;
			position: relative !important;
			font-weight: 500 !important;
			line-height: 35px !important;
			font-size: 18px !important;
			color: #fff !important;
			margin: 0px !important;
			text-transform: uppercase;
		}

		.wpsm_site_sidebar_widget_title h4:after {
			background: inherit;
			content: "";
			height: 60px;
			position: absolute;
			right: -19px;
			top: -7px;
			-webkit-transform: rotate(140deg);
			-moz-transform: rotate(140deg);
			-ms-transform: rotate(140deg);
			-o-transform: rotate(140deg);
			transform: rotate(140deg);
			width: 27px;
		}

		.wpsm_home_portfolio_showcase {
			position: relative;
			width: 100%;
			overflow: hidden;
		}

		.btn-select-design-button {
			/* width: 50%; */
			padding: 26px 50px 22px 50px !important;
			/* color: black; */
			font-size: 30px !important;
			margin-bottom: 20px;
			border-radius: 5px;
			background: #1e73be !important;
			text-decoration: none !important;
			border: 0px;
		}

		.btn-select-design-button:focus {
			color: white;
		}

		.btn-lg {
			padding: 10px 16px;
			font-size: 18px;
			line-height: 1.3333333;
			border-radius: 6px;
		}

		.cd-panel *::after,
		.cd-panel *::before {
			content: '';
		}

		.checked_temp_radio {
			position: absolute;
			background: #FF2300;
			color: #fff;
			top: -14px;
			right: 5px;
			border-radius: 50%;
			width: 35px;
			height: 35px;
			text-align: center;
			line-height: 29px;
			z-index: 999;
			font-size: 18px;
			border: 3px solid #fff;
		}

		.wpsm_home_portfolio_showcase span {
			position: absolute;
			bottom: 0px;
			width: 30%;
			overflow: hidden;
			text-align: center;
			background: rgba(0, 0, 0, 0.8);
			padding-top: 5px;
			padding-bottom: 5px;
			color: #fff;
			border-top-left-radius: 15px;
			font-size: 13px;
			right: 0;
		}

		.wpsm_home_portfolio_showcase span a {
			color: #fff;
			text-decoration: none;
		}

		.fa {
			display: inline-block;
			font: normal normal normal 14px / 1 FontAwesome;
			font-size: inherit;
			text-rendering: auto;
			-webkit-font-smoothing: antialiased;
			-moz-osx-font-smoothing: grayscale;
		}

		.fa-check:before {
			content: "\f00c";
		}

		.wpsm_home_portfolio_links {
			padding: 13px;
			overflow: hidden;
			background: #EFEFEF;
			border-top: 1px dashed #ccc;
		}

		.wpsm_home_portfolio_links h3 {
			margin-top: 10px;
			margin-bottom: 10px;
			font-weight: 900;
			font-size: 15px;
		}

		.wpsm_home_portfolio_links .design_btn {
			background: #F50000;
			border-color: #F50000;
		}

		.wpsm_home_portfolio_links .design_btn_preset {
			background: #F50000;
			border-color: #F50000;
		}

		.wpsm_home_portfolio_links .design_select_btn {
			background: #F50000;
			border-color: #F50000;
		}

		.cd-main-content {
			text-align: center;
		}

		.cd-main-content h1 {
			font-size: 20px;
			font-size: 1.25rem;
			color: #64788c;
			padding: 4em 0;
		}

		.cd-main-content .cd-btn {
			position: relative;
			display: inline-block;
			padding: 1em 2em;
			background-color: #89ba2c;
			color: #ffffff;
			font-weight: bold;
			-webkit-font-smoothing: antialiased;
			-moz-osx-font-smoothing: grayscale;
			border-radius: 50em;
			box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.5), 0 0 5px rgba(0, 0, 0, 0.1);
			-webkit-transition: all 0.2s;
			-moz-transition: all 0.2s;
			transition: all 0.2s;
		}

		.no-touch .cd-main-content .cd-btn:hover {
			box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.5), 0 0 20px rgba(0, 0, 0, 0.3);
		}

		@media only screen and (min-width: 1170px) {
			.cd-main-content h1 {
				font-size: 32px;
				font-size: 2rem;
			}
		}

		.cd-panel {
			position: fixed;
			top: 0;
			left: 0;
			height: 100%;
			width: 100%;
			visibility: hidden;
			-webkit-transition: visibility 0s 0.6s;
			-moz-transition: visibility 0s 0.6s;
			transition: visibility 0s 0.6s;
			z-index: 999999;
		}

		.cd-panel::after {
			/* overlay layer */
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: transparent;
			cursor: pointer;
			-webkit-transition: background 0.3s 0.3s;
			-moz-transition: background 0.3s 0.3s;
			transition: background 0.3s 0.3s;
		}

		.cd-panel.is-visible {
			visibility: visible;
			-webkit-transition: visibility 0s 0s;
			-moz-transition: visibility 0s 0s;
			transition: visibility 0s 0s;
		}

		.cd-panel.is-visible::after {
			background: rgba(0, 0, 0, 0.6);
			-webkit-transition: background 0.3s 0s;
			-moz-transition: background 0.3s 0s;
			transition: background 0.3s 0s;
		}

		.cd-panel.is-visible .cd-panel-close::before {
			-webkit-animation: cd-close-1 0.6s 0.3s;
			-moz-animation: cd-close-1 0.6s 0.3s;
			animation: cd-close-1 0.6s 0.3s;
		}

		.cd-panel.is-visible .cd-panel-close::after {
			-webkit-animation: cd-close-2 0.6s 0.3s;
			-moz-animation: cd-close-2 0.6s 0.3s;
			animation: cd-close-2 0.6s 0.3s;
		}

		@-webkit-keyframes cd-close-1 {

			0%,
			50% {
				-webkit-transform: rotate(0);
			}

			100% {
				-webkit-transform: rotate(45deg);
			}
		}

		@-moz-keyframes cd-close-1 {

			0%,
			50% {
				-moz-transform: rotate(0);
			}

			100% {
				-moz-transform: rotate(45deg);
			}
		}

		@keyframes cd-close-1 {

			0%,
			50% {
				-webkit-transform: rotate(0);
				-moz-transform: rotate(0);
				-ms-transform: rotate(0);
				-o-transform: rotate(0);
				transform: rotate(0);
			}

			100% {
				-webkit-transform: rotate(45deg);
				-moz-transform: rotate(45deg);
				-ms-transform: rotate(45deg);
				-o-transform: rotate(45deg);
				transform: rotate(45deg);
			}
		}

		@-webkit-keyframes cd-close-2 {

			0%,
			50% {
				-webkit-transform: rotate(0);
			}

			100% {
				-webkit-transform: rotate(-45deg);
			}
		}

		@-moz-keyframes cd-close-2 {

			0%,
			50% {
				-moz-transform: rotate(0);
			}

			100% {
				-moz-transform: rotate(-45deg);
			}
		}

		@keyframes cd-close-2 {

			0%,
			50% {
				-webkit-transform: rotate(0);
				-moz-transform: rotate(0);
				-ms-transform: rotate(0);
				-o-transform: rotate(0);
				transform: rotate(0);
			}

			100% {
				-webkit-transform: rotate(-45deg);
				-moz-transform: rotate(-45deg);
				-ms-transform: rotate(-45deg);
				-o-transform: rotate(-45deg);
				transform: rotate(-45deg);
			}
		}

		.cd-panel-header {
			position: fixed;
			width: 90%;
			height: 50px;
			line-height: 50px;
			background: rgba(255, 255, 255, 0.96);
			z-index: 2;
			box-shadow: 0 1px 1px rgba(0, 0, 0, 0.08);
			-webkit-transition: top 0.3s 0s;
			-moz-transition: top 0.3s 0s;
			transition: top 0.3s 0s;
		}

		.cd-panel-header h1 {
			font-weight: bold;
			color: #89ba2c;
			padding-left: 5%;
		}

		.from-right .cd-panel-header,
		.from-left .cd-panel-header {}

		.from-right .cd-panel-header {
			right: 0;
		}

		.from-left .cd-panel-header {
			left: 0;
		}

		.is-visible .cd-panel-header {
			top: 0;
			-webkit-transition: top 0.3s 0.3s;
			-moz-transition: top 0.3s 0.3s;
			transition: top 0.3s 0.3s;
		}

		@media only screen and (min-width: 768px) {
			.cd-panel-header {
				width: 70%;
			}
		}

		@media only screen and (min-width: 1170px) {
			.cd-panel-header {
				width: 50%;
			}
		}

		.cd-panel-close {
			position: absolute;
			top: 0;
			right: 0;
			height: 100%;
			width: 60px;
			/* image replacement */
			display: inline-block;
			overflow: hidden;
			text-indent: 100%;
			white-space: nowrap;
		}

		.cd-panel-close::before,
		.cd-panel-close::after {
			position: absolute;
			top: 22px;
			left: 20px;
			height: 3px;
			width: 20px;
			background-color: #424f5c;
			-webkit-backface-visibility: hidden;
			backface-visibility: hidden;
		}

		.cd-panel-close::before {
			-webkit-transform: rotate(45deg);
			-moz-transform: rotate(45deg);
			-ms-transform: rotate(45deg);
			-o-transform: rotate(45deg);
			transform: rotate(45deg);
		}

		.cd-panel-close::after {
			-webkit-transform: rotate(-45deg);
			-moz-transform: rotate(-45deg);
			-ms-transform: rotate(-45deg);
			-o-transform: rotate(-45deg);
			transform: rotate(-45deg);
		}

		.no-touch .cd-panel-close:hover {
			background-color: #424f5c;
		}

		.no-touch .cd-panel-close:hover::before,
		.no-touch .cd-panel-close:hover::after {
			background-color: #ffffff;
			-webkit-transition-property: -webkit-transform;
			-moz-transition-property: -moz-transform;
			transition-property: transform;
			-webkit-transition-duration: 0.3s;
			-moz-transition-duration: 0.3s;
			transition-duration: 0.3s;
		}

		.no-touch .cd-panel-close:hover::before {
			-webkit-transform: rotate(220deg);
			-moz-transform: rotate(220deg);
			-ms-transform: rotate(220deg);
			-o-transform: rotate(220deg);
			transform: rotate(220deg);
		}

		.no-touch .cd-panel-close:hover::after {
			-webkit-transform: rotate(135deg);
			-moz-transform: rotate(135deg);
			-ms-transform: rotate(135deg);
			-o-transform: rotate(135deg);
			transform: rotate(135deg);
		}

		.cd-panel-container {
			position: fixed;
			width: 90%;
			height: 100%;
			top: 0;
			background: #dbe2e9;
			z-index: 1;
			-webkit-transition-property: -webkit-transform;
			-moz-transition-property: -moz-transform;
			transition-property: transform;
			-webkit-transition-duration: 0.3s;
			-moz-transition-duration: 0.3s;
			transition-duration: 0.3s;
			-webkit-transition-delay: 0.3s;
			-moz-transition-delay: 0.3s;
			transition-delay: 0.3s;
		}

		.from-right .cd-panel-container {
			right: 0;
			-webkit-transform: translate3d(100%, 0, 0);
			-moz-transform: translate3d(100%, 0, 0);
			-ms-transform: translate3d(100%, 0, 0);
			-o-transform: translate3d(100%, 0, 0);
			transform: translate3d(100%, 0, 0);
		}

		.from-left .cd-panel-container {
			left: 0;
			-webkit-transform: translate3d(-100%, 0, 0);
			-moz-transform: translate3d(-100%, 0, 0);
			-ms-transform: translate3d(-100%, 0, 0);
			-o-transform: translate3d(-100%, 0, 0);
			transform: translate3d(-100%, 0, 0);
		}

		.is-visible .cd-panel-container {
			-webkit-transform: translate3d(0, 0, 0);
			-moz-transform: translate3d(0, 0, 0);
			-ms-transform: translate3d(0, 0, 0);
			-o-transform: translate3d(0, 0, 0);
			transform: translate3d(0, 0, 0);
			-webkit-transition-delay: 0s;
			-moz-transition-delay: 0s;
			transition-delay: 0s;
		}

		@media only screen and (min-width: 768px) {
			.cd-panel-container {
				width: 70%;
			}
		}

		@media only screen and (min-width: 1170px) {
			.cd-panel-container {
				width: 50%;
			}
		}

		.cd-panel-content {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			padding: 70px 5%;
			overflow: auto;
			/* smooth scrolling on touch devices */
			-webkit-overflow-scrolling: touch;
		}

		.cd-panel-content p {
			font-size: 14px;
			font-size: 0.875rem;
			color: #424f5c;
			line-height: 1.4;
			margin: 2em 0;
		}

		.cd-panel-content p:first-of-type {
			margin-top: 0;
		}

		@media only screen and (min-width: 768px) {
			.cd-panel-content p {
				font-size: 16px;
				font-size: 1rem;
				line-height: 1.6;
			}
		}

		.acc-ribbon {
			width: 135px;
			background-color: #f11f1f;
			color: white;
			text-align: center;
			padding: 8px 0;
			font-weight: bold;
			font-size: 14px;
			border-radius: 0px;
			position: absolute;
			top: 17px;
			right: -39px;
			transform: rotate(45deg);
			box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
			position: absolute;
		}

		.acc-ribbon.free {
			background-color: #28a745;
		}

		.acc-ribbon.pro {
			background-color: #ff4d4d;
		}

		.buy-now-btn {
			background-color: #007bff !important;
			color: white;
			border: none;
		}

		.buy-now-btn:hover {
			color: white;
		}

		@media (max-width:1500px) {
			.wpsm_ac-panel {
				width: 100%;
			}
		}

		.ac_label {
			margin: 20px 0 10px;
		}
	</style>

	<div class="tabs_pro_admin_wrapper">
		<div class="wpsm_site_sidebar_widget_title">
			<h4>Select Your Design</h2>
		</div>

		<a href="#0" id="cd-btn" class="btn btn btn-primary btn-lg btn-select-design-button">Select Designs</a>
	</div>

	<div class="cd-panel from-right" id="wpsm_cd_panel">
		<header class="cd-panel-header">
			<h1>Select Your Design</h1>
			<a href="#0" class="cd-panel-close" id="wpsm_cd_panel_close">Close</a>
		</header>

		<div class="cd-panel-container">
			<div class="cd-panel-content row">
				<?php for ($i = 1; $i <= $wpsm_no_of_designs; $i++) { ?>
					<div class="col-md-6">
						<div class="demoftr" style="overflow:hidden;">
							<div class="wpsm_home_portfolio_showcase">
								<img class="wpsm_img_responsive ftr_img"
									src="<?php echo wpshopmart_accordion_directory_url . 'assets/images/design/accordion-' . $i . '.png' ?>">
								<span><a target="_blank"
										href="https://wpshopmart.com/demos/accordion-pro/accordion-template-<?php echo $i; ?>/">Demo</a></span>
							</div>
							<div class="wpsm_home_portfolio_links">
								<h3 class="text-center pull-left">Design <?php echo $i; ?></h3>

								<?php if ($i == 1) { ?>
									<!-- Selected Button for the current template -->
									<button type="button" disabled="disabled"
										class="pull-right btn btn-primary wpsm_design_btn design_select_btn"
										id="wpsm_templates_btn_<?php echo $i; ?>">
										Selected
									</button>
									<div class="acc-ribbon free">Free</div>
								<?php } elseif ($i == 1) { ?>
									<!-- Select Button for the first column -->
									<button type="button" class="pull-right btn btn-primary wpsm_design_btn design_select_btn"
										id="wpsm_templates_btn_<?php echo $i; ?>"
										onclick="select_template_h('<?php echo $i; ?>')">
										Select
									</button>
									<div class="acc-ribbon free">Free</div>
								<?php } else { ?>
									<!-- Buy Now Button for others -->
									<a target="_blank" href="https://wpshopmart.com/plugins/accordion-pro/"
										class="pull-right btn wpsm_design_btn design_select_btn buy-now-btn"
										id="wpsm_buy_btn_<?php echo $i; ?>">
										<?php esc_html_e('Buy Now', wpshopmart_accordion_text_domain); ?>
									</a>
									<div class="acc-ribbon pro">Pro</div>
								<?php } ?>

							</div>
						</div>
					</div>
				<?php } ?>
			</div> <!-- cd-panel-content -->
		</div>

		<!-- cd-panel-container -->
	</div>
	<h3><?php _e('Add Accordion', wpshopmart_accordion_text_domain); ?></h3>
	<input type="hidden" name="ac_save_data_action" value="ac_save_data_action" />
	<ul class="clearfix" id="accordion_panel">
		<?php
		$i = 1;
		$accordion_data = unserialize(get_post_meta($post->ID, 'wpsm_accordion_data', true));
		$TotalCount = get_post_meta($post->ID, 'wpsm_accordion_count', true);
		if ($TotalCount) {
			if ($TotalCount != -1) {
				foreach ($accordion_data as $accordion_single_data) {
					$accordion_title = $accordion_single_data['accordion_title'];
					$accordion_title_icon = $accordion_single_data['accordion_title_icon'];
					$enable_single_icon = $accordion_single_data['enable_single_icon'];
					$accordion_desc = $accordion_single_data['accordion_desc'];
					?>
					<li class="wpsm_ac-panel single_acc_box">
						<span class="ac_label"><?php _e('Accordion Title', wpshopmart_accordion_text_domain); ?></span>
						<input type="text" id="accordion_title[]" name="accordion_title[]"
							value="<?php echo esc_attr($accordion_title); ?>" placeholder="Enter Accordion Title Here"
							class="wpsm_ac_label_text">
						<span class="ac_label"><?php _e('Accordion Description', wpshopmart_accordion_text_domain); ?></span>
						<textarea id="accordion_desc[]" name="accordion_desc[]" placeholder="Enter Accordion Description Here"
							class="wpsm_ac_label_text"><?php echo esc_html($accordion_desc); ?></textarea>
						<a type="button" class="btn btn-primary btn-block html_editor_button" data-remodal-target="modal" href="#"
							id="<?php echo esc_attr($i); ?>"
							onclick="open_editor(<?php echo esc_attr($i); ?>)"><?php esc_html_e('Use WYSIWYG Editor', wpshopmart_accordion_text_domain); ?></a>

						<span class="ac_label"><?php _e('Accordion Icon', wpshopmart_accordion_text_domain); ?></span>
						<div class="form-group input-group">
							<input data-placement="bottomRight" id="accordion_title_icon[]" name="accordion_title_icon[]"
								class="form-control icp icp-auto" value="<?php echo esc_attr($accordion_title_icon); ?>" type="text"
								readonly="readonly" />
							<span class="input-group-addon "></span>
						</div>
						<span class="ac_label"><?php _e('Display Above Icon', wpshopmart_accordion_text_domain); ?></span>
						<select name="enable_single_icon[]" style="width:100%">
							<option value="yes" <?php if ($enable_single_icon == 'yes')
								echo "selected=selected"; ?>>
								<?php esc_html_e('Yes', wpshopmart_accordion_text_domain); ?>
							</option>
							<option value="no" <?php if ($enable_single_icon == 'no')
								echo "selected=selected"; ?>>
								<?php esc_html_e('No', wpshopmart_accordion_text_domain); ?>
							</option>

						</select>

						<a class="remove_button" href="#delete" id="remove_bt"><i class="fa fa-trash-o"></i></a>

					</li>
					<?php
					$i++;
				} // end of foreach
			} else {
				echo "<h2>No Accordion Found</h2>";
			}
		} else {
			for ($i = 1; $i <= 2; $i++) {
				?>
				<li class="wpsm_ac-panel single_acc_box">
					<span class="ac_label"><?php _e('Accordion Title', wpshopmart_accordion_text_domain); ?></span>
					<input type="text" id="accordion_title[]" name="accordion_title[]" value="Accordion Sample Title"
						placeholder="Enter Accordion Title Here" class="wpsm_ac_label_text">
					<span class="ac_label"><?php _e('Accordion Description', wpshopmart_accordion_text_domain); ?></span>

					<textarea id="accordion_desc[]" name="accordion_desc[]" placeholder="Enter Accordion Description Here"
						class="wpsm_ac_label_text">Accordion Sample Description</textarea>
					<a type="button" class="btn btn-primary btn-block html_editor_button" data-remodal-target="modal" href="#"
						id="<?php echo esc_attr($i); ?>"
						onclick="open_editor(<?php echo esc_attr($i); ?>)"><?php esc_html_e('Use WYSIWYG Editor', wpshopmart_accordion_text_domain); ?></a>

					<span class="ac_label"><?php _e('Accordion Icon', wpshopmart_accordion_text_domain); ?></span>
					<div class="form-group input-group">
						<input data-placement="bottomRight" id="accordion_title_icon[]" name="accordion_title_icon[]"
							class="form-control icp icp-auto" value="fa-laptop" type="text" readonly="readonly" />
						<span class="input-group-addon "></span>
					</div>
					<span class="ac_label"><?php _e('Display Above Icon', wpshopmart_accordion_text_domain); ?></span>

					<select name="enable_single_icon[]" style="width:100%">
						<option value="yes" selected=selected><?php esc_html_e('Yes', wpshopmart_accordion_text_domain); ?>
						</option>
						<option value="no"><?php esc_html_e('No', wpshopmart_accordion_text_domain); ?></option>
					</select>
					<a class="remove_button" href="#delete" id="remove_bt"><i class="fa fa-trash-o"></i></a>

				</li>
				<?php
			}
		}
		?>
	</ul>
</div>
<!-- Modal Popup For Editor -->
<div class="remodal" data-remodal-options=" closeOnOutsideClick: false" data-remodal-id="modal" role="dialog"
	aria-labelledby="modal1Title" aria-describedby="modal1Desc">
	<button data-remodal-action="close" class="remodal-close" aria-label="Close"></button>
	<div>
		<h2 id="modal1Title"><?php esc_html_e('Accordion Editor', wpshopmart_accordion_text_domain); ?></h2>
		<p id="modal1Desc">
			<?php
			$content = '';
			$editor_id = 'get_text';
			wp_editor($content, $editor_id);
			?>
			<input type="hidden" value="" id="get_id" />
		</p>
	</div>
	<br>
	<button data-remodal-action="cancel" class="remodal-cancel">Cancel</button>
	<button data-remodal-action="confirm" class="remodal-confirm" onclick="insert_html()">OK</button>
</div>





<a class="wpsm_ac-panel add_wpsm_ac_new" id="add_new_ac" onclick="add_new_accordion()">
	<?php _e('Add New Accordion', wpshopmart_accordion_text_domain); ?>
</a>
<a style="float: left;padding:10px !important;background:#31a3dd;" class=" add_wpsm_ac_new delete_all_acc"
	id="delete_all_acc">
	<i style="font-size:57px;" class="fa fa-trash-o"></i>
	<span style="display:block"><?php _e('Delete All', wpshopmart_accordion_text_domain); ?></span>
</a>
<div style="clear:left;"></div>




<?php require('add-ac-js-footer.php'); ?>


<script>

	jQuery(document).ready(function ($) {
		//open the lateral panel
		$('#cd-btn').on('click', function (event) {
			event.preventDefault();
			$('#wpsm_cd_panel').addClass('is-visible');
		});
		//clode the lateral panel
		$('#wpsm_cd_panel').on('click', function (event) {
			if ($(event.target).is('#wpsm_cd_panel') || $(event.target).is('#wpsm_cd_panel_close')) {
				$('#wpsm_cd_panel').removeClass('is-visible');
				event.preventDefault();
			}
		});

	});
</script>