/**
 * External dependencies
 */
import classnames from 'classnames';
import { times } from 'lodash';
import memoize from 'memize';

/**
 * Import Child Block
 */
import './service-item';

/**
 * Block dependencies
 */
import './style.scss';
import './editor.scss';

/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { Fragment } = wp.element;

const {
    BlockAlignmentToolbar,
    InspectorControls,
    InnerBlocks,
} = wp.editor;

const {
    PanelBody,
    RangeControl,
} = wp.components;

/**
 * InnerBlock Settings
 */
const ALLOWED_BLOCKS = [ 'german-themes-blocks/service-item' ];

/**
 * Returns the number of service boxes.
 *
 * @param {number} services Number of services.
 *
 * @return {Object[]} Columns layout configuration.
 */
const getServicesTemplate = memoize( ( services ) => {
    return times( services, () => [ 'german-themes-blocks/service-item', { text: 'Enter your service' } ] );
} );

/**
 * Register block
 */
registerBlockType(
    'german-themes-blocks/services',
    {
        title: __( 'GT Services' ),

        description: __( 'Add a description here' ),

        category: 'layout',

        icon: {
            background: '#7e70af',
            src: 'carrot',
        },

        keywords: [
            __( 'German Themes' ),
            __( 'Services' ),
            __( 'Text' ),
        ],

        attributes: {
            services: {
                type: 'number',
                default: 3,
            },
            columns: {
                type: 'number',
                default: 3,
            },
            blockAlignment: {
                type: 'string',
                default: 'center',
            },
        },

        edit( { attributes, setAttributes, isSelected, className } ) {

            const classNames= classnames( className, {
                [ `gt-columns-${ attributes.columns }` ]: attributes.columns,
            } );

            return (
                <Fragment>

                    <InspectorControls key="inspector">

                        <PanelBody title={ __( 'Layout Settings' ) } initialOpen={ false } className="gt-panel-layout-settings gt-panel">

                            <RangeControl
                                label={ __( 'Columns' ) }
                                value={ attributes.columns }
                                onChange={ ( nextColumns ) => setAttributes( { columns: nextColumns } ) }
                                min={ 2 }
                                max={ 6 }
                            />

                        </PanelBody>

                    </InspectorControls>

                    <div className={ classNames }>
                        <div className="gt-grid-container">

                            <InnerBlocks
                                template={ getServicesTemplate( attributes.services ) }
                                templateLock='all'
                                allowedBlocks={ ALLOWED_BLOCKS }
                            />

                        </div>
                    </div>

                </Fragment>
            );
        },

        save( { attributes } ) {

            const classNames = classnames( {
                [ `gt-columns-${ attributes.columns }` ]: attributes.columns,
                [ `align${ attributes.blockAlignment }` ]: ( 'wide' === attributes.blockAlignment || 'full' === attributes.blockAlignment ),
            } );

            return (
                <div className={ classNames ? classNames : undefined }>
                    <div className="gt-grid-container">
                        <InnerBlocks.Content />
                    </div>
                </div>
            );
        },
    },
);