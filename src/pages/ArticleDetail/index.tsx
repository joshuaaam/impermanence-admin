import { addArticle } from '@/services/ant-design-pro/api';
import {
  PageContainer,
  ProForm,
  // ProFormDatePicker,
  // ProFormDateRangePicker,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { message } from 'antd';
import Card from 'antd/lib/card/Card';
import MdEditor from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
import { useState } from 'react';
import { history } from 'umi';

export default () => {
  const [text, setText] = useState('# Hello Editor');
  return (
    <PageContainer>
      <Card>
        <ProForm
          onFinish={async (e) => {
            const body = Object.assign(e, { tags: e.tags.join(',') });
            // 提交接口
            const res = await addArticle({ data: body });
            if (res.code === 200) {
              history.push('/list');
            }
          }}
          syncToUrl={(values, type) => {
            if (type === 'get') {
              // 为了配合 transform
              // startTime 和 endTime 拼成 createTimeRanger
              return {
                ...values,
                createTimeRanger:
                  values.startTime || values.endTime
                    ? [values.startTime, values.endTime]
                    : undefined,
              };
            }
            // expirationTime 不同步到 url
            return {
              ...values,
              expirationTime: undefined,
            };
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
              red: 'Red',
              green: 'Green',
              blue: 'Blue',
            }}
            fieldProps={{
              mode: 'multiple',
            }}
            placeholder="Please select article tags"
            rules={[{ required: true, message: 'Please select article tags!', type: 'array' }]}
          />

          <ProForm.Item
            label="内容"
            name="content"
            rules={[{ required: true, message: 'Please select article tags!', type: 'string' }]}
          >
            <MdEditor modelValue={text} onChange={setText} />
          </ProForm.Item>
        </ProForm>
      </Card>
    </PageContainer>
  );
};
