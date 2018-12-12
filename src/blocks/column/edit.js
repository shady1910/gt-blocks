/**
 * External dependencies
 */
import classnames from 'classnames';
const { getComputedStyle } = window;
const { partial, castArray, last } = window.lodash;

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { compose } = wp.compose;
const { dispatch, select, withDispatch, withSelect } = wp.data;
const {
	Component,
	Fragment,
} = wp.element;

const {
	ContrastChecker,
	InnerBlocks,
	InspectorControls,
	PanelColorSettings,
	withColors,
} = wp.editor;

const {
	IconButton,
	withFallbackStyles,
} = wp.components;

const {
	cloneBlock,
} = wp.blocks;

/**
 * Block Edit Component
 */
class columnEdit extends Component {
	duplicateColumn() {
		const {
			getBlocksByClientId,
			getBlockIndex,
			getBlockRootClientId,
		} = select( 'core/editor' );

		const {
			insertBlocks,
			updateBlockAttributes,
		} = dispatch( 'core/editor' );

		// Get current block.
		const { clientId } = this.props;
		const block = getBlocksByClientId( clientId )[ 0 ];

		// Get parent block.
		const rootClientId = getBlockRootClientId( clientId );
		const parentBlock = getBlocksByClientId( rootClientId )[ 0 ];

		// Get position to insert duplicated block.
		const lastSelectedIndex = getBlockIndex( last( castArray( clientId ) ), rootClientId );

		// Clone and insert block.
		const clonedBlock = cloneBlock( block );
		insertBlocks( clonedBlock, lastSelectedIndex + 1, rootClientId );

		// Update number of items in parent block.
		updateBlockAttributes( rootClientId, { items: parentBlock.attributes.items + 1 } );
	}

	removeColumn() {
		const {
			getBlocksByClientId,
			getBlockRootClientId,
		} = select( 'core/editor' );

		const {
			removeBlocks,
			updateBlockAttributes,
		} = dispatch( 'core/editor' );

		// Get parent block.
		const rootClientId = getBlockRootClientId( this.props.clientId );
		const parentBlock = getBlocksByClientId( rootClientId )[ 0 ];

		// Remove block.
		removeBlocks( this.props.clientId );

		// Update number of items in parent block.
		updateBlockAttributes( rootClientId, { items: parentBlock.attributes.items - 1 } );
	}

	render() {
		const {
			attributes,
			backgroundColor,
			setBackgroundColor,
			fallbackBackgroundColor,
			textColor,
			setTextColor,
			fallbackTextColor,
			className,
			isSelected,
			isParentBlockSelected,
			isChildBlockSelected,
			onMoveUp,
			onMoveDown,
			isFirstColumn,
			isLastColumn,
		} = this.props;

		const {
			allowedBlocks,
			template,
			templateLock,
		} = attributes;

		const columnClasses = classnames( 'gt-column', {
			'has-text-color': textColor.color,
			[ textColor.class ]: textColor.class,
			'has-background': backgroundColor.color,
			[ backgroundColor.class ]: backgroundColor.class,
		} );

		const columnStyles = {
			color: textColor.class ? undefined : textColor.color,
			backgroundColor: backgroundColor.class ? undefined : backgroundColor.color,
		};

		return (
			<Fragment>

				<InspectorControls key="inspector">

					<PanelColorSettings
						title={ __( 'Color Settings', 'gt-layout-blocks' ) }
						initialOpen={ false }
						colorSettings={ [
							{
								value: backgroundColor.color,
								onChange: setBackgroundColor,
								label: __( 'Background Color', 'gt-layout-blocks' ),
							},
							{
								value: textColor.color,
								onChange: setTextColor,
								label: __( 'Text Color', 'gt-layout-blocks' ),
							},
						] }
					>
						<ContrastChecker
							{ ...{
								textColor: textColor.color,
								backgroundColor: backgroundColor.color,
								fallbackTextColor,
								fallbackBackgroundColor,
							} }
						/>
					</PanelColorSettings>

				</InspectorControls>

				<div className={ className }>

					<div className={ columnClasses } style={ columnStyles }>

						<InnerBlocks
							template={ template || undefined }
							templateLock={ templateLock || false }
							{ ...( allowedBlocks && { allowedBlocks } ) }
						/>

					</div>

					{ ( isSelected || isParentBlockSelected || isChildBlockSelected ) && (
						<div className="gt-column-controls">

							<IconButton
								className="move-up-column"
								label={ __( 'Move up', 'gt-layout-blocks' ) }
								icon="arrow-left-alt2"
								onClick={ isFirstColumn ? null : onMoveUp }
								disabled={ isFirstColumn }
							/>

							<IconButton
								className="move-down-column"
								label={ __( 'Move down', 'gt-layout-blocks' ) }
								icon="arrow-right-alt2"
								onClick={ isLastColumn ? null : onMoveDown }
								disabled={ isLastColumn }
							/>

							<IconButton
								className="duplicate-column"
								label={ __( 'Duplicate', 'gt-layout-blocks' ) }
								icon="admin-page"
								onClick={ () => this.duplicateColumn() }
							/>

							<IconButton
								className="remove-column"
								label={ __( 'Remove', 'gt-layout-blocks' ) }
								icon="trash"
								onClick={ () => this.removeColumn() }
							/>
						</div>
					) }

				</div>

			</Fragment>
		);
	}
}

export default compose( [
	withSelect( ( select, { clientId } ) => {
		const {
			getBlockCount,
			getBlockIndex,
			getBlockRootClientId,
			isBlockSelected,
			hasSelectedInnerBlock,
		} = select( 'core/editor' );

		const rootClientId = getBlockRootClientId( clientId );
		const columnIndex = getBlockIndex( clientId, rootClientId );
		const columnCount = getBlockCount( rootClientId );

		return {
			isParentBlockSelected: isBlockSelected( rootClientId ),
			isChildBlockSelected: hasSelectedInnerBlock( rootClientId, true ),
			isFirstColumn: 0 === columnIndex,
			isLastColumn: columnCount === ( columnIndex + 1 ),
			rootClientId,
		};
	} ),
	withDispatch( ( dispatch, { clientId, rootClientId } ) => {
		const { moveBlocksDown, moveBlocksUp } = dispatch( 'core/editor' );
		return {
			onMoveDown: partial( moveBlocksDown, clientId, rootClientId ),
			onMoveUp: partial( moveBlocksUp, clientId, rootClientId ),
		};
	} ),
	withColors( 'backgroundColor', { textColor: 'color' } ),
	withFallbackStyles( ( node, ownProps ) => {
		const { textColor, backgroundColor } = ownProps.attributes;
		const editableNode = node.querySelector( '[contenteditable="true"]' );
		//verify if editableNode is available, before using getComputedStyle.
		const computedStyles = editableNode ? getComputedStyle( editableNode ) : null;
		return {
			fallbackBackgroundColor: backgroundColor || ! computedStyles ? undefined : computedStyles.backgroundColor,
			fallbackTextColor: textColor || ! computedStyles ? undefined : computedStyles.color,
		};
	} ),
] )( columnEdit );
