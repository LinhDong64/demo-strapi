import React from 'react';
import PropTypes from 'prop-types';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import styled from 'styled-components';
import { auth } from 'strapi-helper-plugin';
import StrapiUploadAdapter from '@martinkronstad/ckeditor5-strapi-upload-adapter'; 

const Wrapper = styled.div`
  .ck-editor__main {
    min-height: 200px;
    > div {
      min-height: 200px;
    }
  }
`;

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
        data={value}
        onChange={(event, editor) => {
          const data = editor.getData();
          onChange({ target: { name, value: data } });
        }}
        config={{
          extraPlugins: [StrapiUploadAdapter],
          strapiUploadAdapter: {
            uploadUrl: `${strapi.backendURL}/upload`,
            absUrl: `${strapi.backendURL}`,
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