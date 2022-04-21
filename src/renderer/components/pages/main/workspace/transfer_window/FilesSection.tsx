import React from 'react'
import Styles from './FilesSection.module.scss'

import { FilePerson } from '../../person/FilePerson'
import BaseHelper from 'renderer/helpers/BaseHelper'

// export function FilesSection() {
//     let file_icon: React.ReactNode = <div className={Styles.File}>
//         <span className={BaseHelper.classes(Styles.FileIcon, Styles.MaterialIcon)}>
//             folder
//         </span>
//     </div>
//
//     return (
//         <div>
//             <div className={Styles.TitleText}>
//                 Active transfer
//             </div>
//             <div className={Styles.Hint}>Receiving 15 files</div>
//             <div className={Styles.List}>
//                     <FilePerson name="My homework" avatar={file_icon} size={16.01} filesCount={14} percent={98} />
//                     <FilePerson name="Work" avatar={file_icon} size={18.05} filesCount={5} percent={56} />
//             </div>
//         </div>
//     )
// }
