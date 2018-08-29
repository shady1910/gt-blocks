/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Block dependencies
 */
import './style.scss';
import './editor.scss';
import { gtPortfolioIcon } from './icons';
import edit from './edit';

/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const {
    RichText,
    getColorClass,
    getFontSizeClass,
} = wp.editor;

/**
 * Register block
 */
registerBlockType(
    'german-themes-blocks/portfolio',
    {
        title: __( 'GT Portfolio' ),

        description: __( 'Add a description here' ),

        category: 'germanthemes',

        icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/></svg>,

        keywords: [
            __( 'German Themes' ),
            __( 'Portfolio' ),
            __( 'Layout' ),
        ],

        attributes: {
            items: {
                type: 'array',
                source: 'query',
                selector: '.gt-grid-item',
                query: {
                    imgID: {
                        type: 'number',
                        source: 'attribute',
                        attribute: 'data-img-id',
                        selector: '.gt-image img',
                    },
                    imgURL: {
                        type: 'string',
                        source: 'attribute',
                        attribute: 'src',
                        selector: '.gt-image img',
                    },
                    imgAlt: {
                        type: 'string',
                        source: 'attribute',
                        attribute: 'alt',
                        selector: '.gt-image img',
                    },
                    title: {
                        type: 'array',
                        source: 'children',
                        selector: '.gt-title',
                    },
                    text: {
                        type: 'array',
                        source: 'children',
                        selector: '.gt-text',
                    },
                },
                default: [
                    { 'title': '', 'text': '' },
                    { 'title': '', 'text': '' },
                ]
            },
            columns: {
                type: 'number',
                default: 2,
            },
            blockAlignment: {
                type: 'string',
                default: 'center',
            },
            textAlignment: {
                type: 'string',
            },
            imageSize: {
                type: 'string',
                default: 'full',
            },
            titleTag: {
                type: 'number',
                default: 2,
            },
            textColor: {
                type: 'string',
            },
            backgroundColor: {
                type: 'string',
            },
            customTextColor: {
                type: 'string',
            },
            customBackgroundColor: {
                type: 'string',
            },
            fontSize: {
                type: 'string',
            },
            customFontSize: {
                type: 'number',
            },
        },

        getEditWrapperProps( attributes ) {
            const { blockAlignment } = attributes;
            if ( 'wide' === blockAlignment || 'full' === blockAlignment ) {
                return { 'data-align': blockAlignment };
            }
        },

        edit,

        save( { attributes } ) {
            const {
                backgroundColor,
                textColor,
                customBackgroundColor,
                customTextColor,
                fontSize,
                customFontSize,
            } = attributes;

            const textClass = getColorClass( 'color', textColor );
            const backgroundClass = getColorClass( 'background-color', backgroundColor );
            const fontSizeClass = getFontSizeClass( fontSize );

            const classNames = classnames( {
                [ `gt-columns-${ attributes.columns }` ]: attributes.columns,
                [ `align${ attributes.blockAlignment }` ]: ( 'wide' === attributes.blockAlignment || 'full' === attributes.blockAlignment ),
            } );

            const contentClasses = classnames( 'gt-content', {
                'has-background': backgroundColor || customBackgroundColor,
                [ backgroundClass ]: backgroundClass,
            } );

            const contentStyles = {
                textAlign: attributes.textAlignment,
                backgroundColor: backgroundClass ? undefined : customBackgroundColor,
            };

            const textClasses = classnames( 'gt-text', {
                'has-text-color': textColor || customTextColor,
                [ textClass ]: textClass,
                [ fontSizeClass ]: fontSizeClass,
            } );

            const textStyles = {
                color: textClass ? undefined : customTextColor,
                fontSize: fontSizeClass ? undefined : customFontSize,
            };

            const titleTag = 'h' + attributes.titleTag;

            return (
                <div className={ classNames ? classNames : undefined }>
                    <div className="gt-grid-container">

                        {
                            attributes.items.map( ( item, index ) => {

                                return (
                                    <div className="gt-grid-item" key={ index }>

                                        <div className="gt-image">
                                            <img
                                                src={ item.imgURL }
                                                alt={ item.imgAlt }
                                                data-img-id={ item.imgID }
                                            />
                                        </div>

                                        <div className={ contentClasses } style={ contentStyles }>

                                            <RichText.Content
                                                tagName={ titleTag }
                                                className="gt-title"
                                                value={ item.title }
                                            />

                                            <RichText.Content
                                                tagName="div"
                                                className={ textClasses }
                                                value={ item.text }
                                                style={ textStyles }
                                            />

                                        </div>

                                    </div>
                                );
                            })
                        }

                    </div>
                </div>
            );
        },

    },
);
