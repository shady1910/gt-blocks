/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal block libraries
 */
 const { Component, compose } = wp.element;
 const { __, sprintf } = wp.i18n;
 const {
     AlignmentToolbar,
     BlockControls,
     ColorPalette,
     ImagePlaceholder,
     InspectorControls,
     MediaUpload,
     registerBlockType,
     RichText,
 } = wp.blocks;

 const {
     Button,
     DropZone,
     FormFileUpload,
     IconButton,
     PanelBody,
     PanelColor,
     Placeholder,
     RangeControl,
     SelectControl,
     TextControl,
     ToggleControl,
     Toolbar,
     Tooltip,
     withAPIData,
 } = wp.components;

 const {
     mediaUpload,
 } = wp.utils;

class gtPortfolioBlock extends Component {
    constructor() {
        super( ...arguments );

        this.addPortfolioItem = this.addPortfolioItem.bind( this );
        this.onChangeTitle = this.onChangeTitle.bind( this );
        this.onChangeText = this.onChangeText.bind( this );
        this.onSetActiveEditable = this.onSetActiveEditable.bind( this );
    }

    addPortfolioItem() {
        const newItems = [...this.props.attributes.items];
        newItems.push( { 'title': '', 'text': '' } );
        this.props.setAttributes( { items: newItems } );
    }

    removePortfolioItem( index ) {
        const newItems = [...this.props.attributes.items].filter( (value, key) => key !== index );
        this.props.setAttributes( { items: newItems } );
    }

    onChangeTitle( newTitle, index ) {
        const newItems = [...this.props.attributes.items];
        if( newItems[index] !== undefined ) {
            newItems[index].title = newTitle;
        }
        this.props.setAttributes( { items: newItems } );
    }

    onChangeText( newText, index ) {
        const newItems = [...this.props.attributes.items];
        if( newItems[index] !== undefined ) {
            newItems[index].text = newText;
        }
        this.props.setAttributes( { items: newItems } );
    }

    onSetActiveEditable( newEditable ) {
        this.props.setAttributes( { editable: newEditable  } );
    }

    render() {
        const { attributes, setAttributes, isSelected, className } = this.props;

        const classNames= classnames( className, {
            'gt-items-edited': attributes.editItems,
        } );

        return (
            <div className={ classNames }>
                <div className="block-container">

                    {
                        attributes.items.map( ( item, index ) => {
                            return (
                                <div className="block-item">

                                    <RichText
                                        tagName="h2"
                                        placeholder={ __( 'Enter a title' ) }
                                        value={ item.title }
                                        className="block-title"
                                        onChange={ ( newTitle ) => this.onChangeTitle( newTitle, index ) }
                                        isSelected={ isSelected && attributes.editable === `title${index}` }
                                        onFocus={ () => this.onSetActiveEditable( `title${index}` ) }
                                    />

                                    <RichText
                                        tagName="div"
                                        multiline="p"
                                        placeholder={ __( 'Enter your text here.' ) }
                                        value={ item.text }
                                        className="block-text"
                                        onChange={ ( newText ) => this.onChangeText( newText, index ) }
                                        isSelected={ isSelected && attributes.editable === `text${index}` }
                                        onFocus={ () => this.onSetActiveEditable( `text${index}` ) }
                                    />

                                    { attributes.editItems && (
                                        <IconButton
                                            className="remove-portfolio-item"
                                            label={ __( 'Remove Item' ) }
                                            icon="no-alt"
                                            onClick={ () => this.removePortfolioItem( index ) }
                                        />
                                    ) }

                                </div>
                            );
                        })
                    }

                </div>

                { isSelected && [
                    <Button
                        isLarge
                        onClick={ this.addPortfolioItem }
                    >
                        { __( 'Add portfolio item' ) }
                    </Button>
                    ,
                    <Button
                        isLarge
                        onClick={ () => setAttributes( { editItems: ! attributes.editItems } ) }
                    >
                        { __( 'Edit portfolio items' ) }
                    </Button>
                ] }
            </div>
        );
    }
}

export default gtPortfolioBlock;
