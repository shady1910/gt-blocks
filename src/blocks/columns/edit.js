/**
 * External dependencies
 */
import classnames from 'classnames';
import memoize from 'memize';
const { times } = lodash;

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const {
	Component,
	Fragment,
} = wp.element;

const {
	InnerBlocks,
	InspectorControls,
} = wp.editor;

const {
	PanelBody,
	SelectControl,
} = wp.components;

/**
 * Internal dependencies
 */
import './editor.scss';

/**
 * Returns the layouts configuration for a given number of items.
 *
 * @param {number} number Number of items.
 *
 * @return {Object[]} Items layout configuration.
 */
const getTemplate = memoize( ( number ) => {
	return times( number, () => [ 'gt-blocks/column', {} ] );
} );

/**
 * Block Edit Component
 */
class ColumnsEdit extends Component {
	constructor() {
		super( ...arguments );
		this.updateColumns = this.updateColumns.bind( this );
	}

	updateColumns( value ) {
		let columns = 2;
		const threeColumnLayouts = [
			'25-25-50',
			'25-50-25',
			'50-25-25',
			'30-40-30',
			'20-60-20',
			'33-33-33',
		];
		const fourColumnLayouts = [
			'25-25-25-25',
		];

		if ( threeColumnLayouts.includes( value ) ) {
			columns = 3;
		} else if ( fourColumnLayouts.includes( value ) ) {
			columns = 4;
		}

		this.props.setAttributes( {
			columns: columns,
			columnLayout: value,
		} );
	}

	render() {
		const {
			attributes,
			setAttributes,
			className,
		} = this.props;

		const {
			items,
			columns,
			columnLayout,
			columnGap,
		} = attributes;

		const columnClasses = classnames( 'gt-columns-container', {
			[ `gt-columns-${ columnLayout }` ]: columnLayout,
			[ `gt-column-count-${ columns }` ]: columns,
			[ `gt-${ columnGap }-column-gap` ]: 'normal' !== columnGap,
		} );

		return (
			<Fragment>

				<InspectorControls key="inspector">

					<PanelBody title={ __( 'Layout Settings', 'gt-blocks' ) } initialOpen={ false } className="gt-panel-layout-settings gt-panel">

						<SelectControl
							label={ __( 'Columns', 'gt-blocks' ) }
							value={ columnLayout }
							onChange={ this.updateColumns }
							options={ [
								{ value: '25-75', label: __( '25% | 75%', 'gt-blocks' ) },
								{ value: '75-25', label: __( '75% | 25%', 'gt-blocks' ) },
								{ value: '33-66', label: __( '33% | 66%', 'gt-blocks' ) },
								{ value: '66-33', label: __( '66% | 33%', 'gt-blocks' ) },
								{ value: '40-60', label: __( '40% | 60%', 'gt-blocks' ) },
								{ value: '60-40', label: __( '60% | 40%', 'gt-blocks' ) },
								{ value: '50-50', label: __( '50% | 50%', 'gt-blocks' ) },
								{ value: '25-25-50', label: __( '25% | 25% | 50%', 'gt-blocks' ) },
								{ value: '25-50-25', label: __( '25% | 50% | 25%', 'gt-blocks' ) },
								{ value: '50-25-25', label: __( '50% | 25% | 25%', 'gt-blocks' ) },
								{ value: '30-40-30', label: __( '30% | 40% | 30%', 'gt-blocks' ) },
								{ value: '20-60-20', label: __( '20% | 60% | 20%', 'gt-blocks' ) },
								{ value: '33-33-33', label: __( '33% | 33% | 33%', 'gt-blocks' ) },
							] }
						/>

						<SelectControl
							label={ __( 'Column Gap', 'gt-blocks' ) }
							value={ columnGap }
							onChange={ ( value ) => setAttributes( { columnGap: value } ) }
							options={ [
								{ value: 'none', label: __( 'None', 'gt-blocks' ) },
								{ value: 'small', label: __( 'Small', 'gt-blocks' ) },
								{ value: 'normal', label: __( 'Normal', 'gt-blocks' ) },
								{ value: 'medium', label: __( 'Medium', 'gt-blocks' ) },
								{ value: 'large', label: __( 'Large', 'gt-blocks' ) },
								{ value: 'extra-large', label: __( 'Extra Large', 'gt-blocks' ) },
							] }
						/>

					</PanelBody>

				</InspectorControls>

				<div className={ className }>

					<div className={ columnClasses }>

						<InnerBlocks
							template={ getTemplate( items ) }
							templateLock={ false }
							allowedBlocks={ [ 'gt-blocks/column' ] }
						/>

					</div>

				</div>
			</Fragment>
		);
	}
}

export default ColumnsEdit;
