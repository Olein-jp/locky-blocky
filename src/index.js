import { registerPlugin } from '@wordpress/plugins';
import { addFilter } from '@wordpress/hooks';
import { Fragment } from '@wordpress/element';
import {
    BlockControls,
    store as blockEditorStore,
} from '@wordpress/block-editor';
import {
    ToolbarDropdownMenu,
    ToggleControl,
} from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';
import { __ } from '@wordpress/i18n';
import { useDispatch, useSelect } from '@wordpress/data';

const TemplateLockControl = ( { templateLock, onToggle } ) => (
    <div style={ { padding: '8px', minWidth: '200px' } }>
        <ToggleControl
            label={ __( 'Enable Content Only', 'locky-blocky' ) }
            checked={ templateLock === 'contentOnly' }
            onChange={ onToggle }
            help={ __( 'Restricts editing to content only.', 'locky-blocky' ) }
        />
    </div>
);

const withTemplateLockToggle = createHigherOrderComponent( ( BlockEdit ) => {
    return ( props ) => {
        const { clientId, attributes } = props;
        const { updateBlockAttributes } = useDispatch( blockEditorStore );
        const templateLock = attributes.templateLock || false;

        // 祖先ブロックにcontentOnlyが設定されているかをチェック
        const hasAncestorContentOnly = useSelect( ( select ) => {
            const { getBlockParents, getBlock } = select( blockEditorStore );
            const parentIds = getBlockParents( clientId );
            return parentIds.some( ( parentId ) => {
                const parentBlock = getBlock( parentId );
                return parentBlock && parentBlock.attributes && parentBlock.attributes.templateLock === 'contentOnly';
            } );
        }, [ clientId ] );

        // Hide menu if any ancestor has templateLock set to contentOnly
        if ( hasAncestorContentOnly ) {
            return <BlockEdit { ...props } />;
        }

        const toggleTemplateLock = () => {
            updateBlockAttributes( clientId, {
                templateLock: templateLock === 'contentOnly' ? false : 'contentOnly',
            } );
        };
        return (
            <Fragment>
                <BlockEdit { ...props } />
                <BlockControls>
                    <ToolbarDropdownMenu
                        icon="lock"
                        label={ __( 'Block Template Lock', 'locky-blocky' ) }
                    >
                        { () => (
                            <TemplateLockControl
                                templateLock={ templateLock }
                                onToggle={ toggleTemplateLock }
                            />
                        ) }
                    </ToolbarDropdownMenu>
                </BlockControls>
            </Fragment>
        );
    };
}, 'withTemplateLockToggle' );

addFilter(
    'editor.BlockEdit',
    'locky-blocky/with-template-lock-toggle',
    withTemplateLockToggle
);

registerPlugin('locky-blocky', {
    render: () => null,
});
