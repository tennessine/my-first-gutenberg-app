import { render, useState } from '@wordpress/element'

import {
  Panel,
  PanelBody,
  TextareaControl,
  Button,
  SnackbarList,
} from '@wordpress/components'

import { store as coreStore } from '@wordpress/core-data'
import { store as noticesStore } from '@wordpress/notices'

import { useSelect, useDispatch, registerStore } from '@wordpress/data'

function App() {
  const [content, setContent] = useState('')
  const tags = content
    .split('\n')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0)

  const { saveEntityRecord } = useDispatch(coreStore)

  const { createSuccessNotice } = useDispatch(noticesStore)

  const handleClick = async () => {
    for (const name of tags) {
      const savedTag = await saveEntityRecord('taxonomy', 'post_tag', {
        name,
      })
      console.log(savedTag)
    }
    createSuccessNotice('创建成功!', {
      type: 'snackbar',
    })
  }

  return (
    <Panel>
      <PanelBody title="批量创建tags">
        <TextareaControl
          label="tags"
          value={content}
          onChange={setContent}
          rows={20}
        />
        <Button variant="primary" onClick={handleClick}>
          批量添加
        </Button>
        <Notifications />
      </PanelBody>
    </Panel>
  )
}

function Notifications() {
  const notices = useSelect((select) => select(noticesStore).getNotices(), [])
  const { removeNotice } = useDispatch(noticesStore)
  const snackbarNotices = notices.filter(({ type }) => type === 'snackbar')
  return (
    <SnackbarList
      notices={snackbarNotices}
      className="components-editor-notices__snackbar"
      onRemove={removeNotice}
    />
  )
}

window.addEventListener('load', function () {
  render(<App />, document.querySelector('#my-first-gutenberg-app'))
})
