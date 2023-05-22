import { addArticle, getArticleById, updateArticle } from '@/services/ant-design-pro/api';
import {
  PageContainer,
  ProForm,
  ProFormDateTimePicker,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import Card from 'antd/lib/card/Card';
import MdEditor from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
import moment from 'moment';
import { useState } from 'react';
import { history } from 'umi';

export default () => {
  const [text, setText] = useState('');
  const [isCommit, setIsCommit] = useState(true);
  const [id, setId] = useState(null);
  return (
    <PageContainer>
      <Card>
        <ProForm
          request={async () => {
            const location = history.location;
            if (location.query && location.query.id) {
              setIsCommit(false);
              const res = await getArticleById({ data: { id: location.query.id } });
              if (res.code === 200) {
                const data = JSON.parse(JSON.stringify(res.data));
                data.tags = data.tags.split(',');
                setText(data.content);
                setId(data.id);
                return data;
              }
            }
          }}
          onFinish={async (e) => {
            const body = Object.assign(e, { tags: e.tags.join(',') });
            // 提交接口
            const res = isCommit
              ? await addArticle({ data: body })
              : await updateArticle({ data: Object.assign(body, { id: id }) });
            if (res.code === 200) {
              history.push('/list');
            }
          }}
          initialValues={{
            name: '蚂蚁设计有限公司',
            useMode: 'chapter',
          }}
          autoFocusFirstInput
        >
          <ProFormText
            name="title"
            label="标题"
            placeholder="Please input article title"
            rules={[{ required: true, message: 'Please input article title!', type: 'string' }]}
          />

          <ProFormSelect
            name="tags"
            label="标签"
            valueEnum={{
              article: '文章',
              blog: '博客',
              travel: '旅游',
            }}
            fieldProps={{
              mode: 'multiple',
            }}
            placeholder="Please select article tags"
            rules={[{ required: true, message: 'Please select article tags!', type: 'array' }]}
          />

          <ProFormDateTimePicker
            label="创建时间"
            name="create_time"
            initialValue={moment('2021-08-09')}
            rules={[{ required: true, message: '请输入内容' }]}
          />

          <ProForm.Item
            label="内容"
            name="content"
            rules={[{ required: true, message: '请输入内容', type: 'string' }]}
          >
            <MdEditor modelValue={text} onChange={setText} />
          </ProForm.Item>
        </ProForm>
      </Card>
    </PageContainer>
  );
};
