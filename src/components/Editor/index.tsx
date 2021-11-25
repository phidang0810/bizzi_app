import React, { useState, useEffect, useRef, MouseEventHandler } from 'react'

import { CKEditor } from 'ckeditor4-react';

type Props = {
    value?: string,
    onChange: Function
}
export const Editor: React.FC<Props> = ({value, onChange}) => {    
    
    return (    
        <CKEditor
                initData={value}
                onChange={(ctx) => {                    
                    onChange(ctx.editor.getData());
                } }
                
            />    
            // <CKEditor
            //     editor={ ClassicEditor }
            //     config={{
            //         simpleUpload: {
            //             uploadUrl: '/upload',
            //             withCredentials: false,
            //             headers: {
            //                 Authorization: 'Bearer ' + access_token,
            //                 Accept: 'application/json'
            //             },
            //         }
            //       }}
            //     data={value}
            //     onChange={ ( event: any, editor : any ) => {
            //         const data = editor.getData();
            //         onChange(data);
            //     } }
            // />
        )
}