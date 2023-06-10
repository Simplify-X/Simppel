// @ts-nocheck

import React from 'react';
import dynamic from 'next/dynamic';

const DynamicTinyMCE = dynamic(() => import('@tinymce/tinymce-react').then((module) => module.Editor), {
  ssr: false,
});

const MyEditor = ({ handleEditorChange, initialValue  }) => {
  const handleEditorContentChange = (content) => {
    handleEditorChange(content); // Pass the content to the parent component's handler
  };

  return (
    <DynamicTinyMCE
      apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY} // Add your TinyMCE API key
      value={initialValue}
      init={{
        selector: 'textarea',
        plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss',
        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
        tinycomments_mode: 'embedded',
        tinycomments_author: 'Author name',
        mergetags_list: [
          { value: 'First.Name', title: 'First Name' },
          { value: 'Email', title: 'Email' },
        ],
        
        // Add your custom settings and configurations here
      }}
      onEditorChange={handleEditorContentChange} // Pass the content to the handler
    />
  );
};

export default MyEditor;
