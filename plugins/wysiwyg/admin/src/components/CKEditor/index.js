import React from 'react';
import PropTypes from 'prop-types';
import { CKEditor } from '@ckeditor/ckeditor5-react';
// import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import DecoupledEditor from 'ckeditor-build-with-simple-upload-provider-strapi';
import styled from 'styled-components';
import { auth } from 'strapi-helper-plugin';

const Wrapper = styled.div`
  .ck-editor__main {
    min-height: 200px;
    > div {
      min-height: 200px;
    }
  }
`;
const highlight = [
  {
    model: 'greenMarker',
    class: 'marker-green',
    title: 'Green marker',
    color: 'var(--ck-highlight-marker-green)',
    type: 'marker'
  },
  {
    model: 'redPen',
    class: 'pen-red',
    title: 'Red pen',
    color: 'var(--ck-highlight-pen-red)',
    type: 'pen'
  }
]
const configuration = {
  toolbar: [
    'heading',
    '|',
    'fontSize',
    'fontFamily',
    'fontBackgroundColor',
    'fontcolor',
    '|',
    'bold',
    'italic',
    'underLine',
    'strikethrough',
    // 'highlight',
    '|',
    'alignment',
    '|',
    'numberedList',
    'bulletedList',
    '|',
    'indent',
    'outdent',
    '|',
    'undo',
    'redo',
    'blockQuote',
  ],
};

const Editor = ({ onChange, name, value }) => {
  const jwtToken = auth.getToken();
  return (
    <Wrapper>
      <CKEditor
        onReady={editor => {
          console.log('Editor is ready to use!', editor);

          // Insert the toolbar before the editable area.
          editor.ui.getEditableElement().parentElement.insertBefore(
            editor.ui.view.toolbar.element,
            editor.ui.getEditableElement()
          );

          this.editor = editor;
          return editor.setData(value);
        }}
        onError={({ willEditorRestart }) => {
          // If the editor is restarted, the toolbar element will be created once again.
          // The `onReady` callback will be called again and the new toolbar will be added.
          // This is why you need to remove the older toolbar.
          if (willEditorRestart) {
            this.editor.ui.view.toolbar.element.remove();
          }
        }}
        editor={DecoupledEditor}
        config={configuration}
        data={value}
        onChange={(event, editor) => {
          const data = editor.getData();
          onChange({ target: { name, value: data } });
        }}
        // shouldNotGroupWhenFull={false}
        // highlight 
        config={{
          simpleUpload: {
            uploadUrl: `${strapi.backendURL}/upload`,
            headers: {
              Authorization: "Bearer " + jwtToken
            }
          }
        }}
      />
    </Wrapper>
  );
};

Editor.propTypes = {
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
};

export default Editor;