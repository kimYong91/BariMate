import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layout,
  Typography,
  Input,
  Select,
  Button,
  Row,
  Col,
  Form,
  message,
  Spin,
} from 'antd';
import {
  PlusCircleOutlined,
  RobotOutlined,
} from '@ant-design/icons';
import BottomNavBar from '../../components/layout/BottomNavBar';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const MemoCreatePage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  // 메모 생성 후 AI 설명 요청
  const handleAIExplanation = async (values: any) => {
    try {
      setAiLoading(true);
      
      // 1. 먼저 메모 생성
      const memoResponse = await fetch('/api/memos/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: values.title,
          category: values.category,
          content: values.content,
          user_id: 1 // 개발 단계 고정값
        }),
      });

      if (!memoResponse.ok) {
        throw new Error('메모 생성에 실패했습니다.');
      }

      const memoData = await memoResponse.json();
      const memoId = memoData.memo.id;

      message.success('메모가 생성되었습니다. AI 설명을 생성 중입니다...');

      // 2. AI 설명 생성
      const aiResponse = await fetch(`/api/ai/explain-memo/${memoId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!aiResponse.ok) {
        const errorData = await aiResponse.json();
        throw new Error(errorData.detail || 'AI 설명 생성에 실패했습니다.');
      }

      message.success('AI 설명이 생성되었습니다!');
      
      // 3. AI 설명 페이지로 이동
      navigate(`/ai-explanation/${memoId}`);

    } catch (error) {
      console.error('AI 설명 생성 오류:', error);
      message.error(error instanceof Error ? error.message : 'AI 설명 생성 중 오류가 발생했습니다.');
    } finally {
      setAiLoading(false);
    }
  };

  // 단순 메모 저장 (AI 설명 없이)
  const handleSaveMemo = async (values: any) => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/memos/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: values.title,
          category: values.category,
          content: values.content,
          user_id: 1
        }),
      });

      if (!response.ok) {
        throw new Error('메모 생성에 실패했습니다.');
      }

      message.success('메모가 저장되었습니다!');
      form.resetFields();

    } catch (error) {
      console.error('메모 저장 오류:', error);
      message.error('메모 저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Content style={{ padding: '20px 16px 80px 16px' }}>
        <Form
          form={form}
          layout="vertical"
          style={{ maxWidth: '400px', margin: '0 auto' }}
        >
          {/* 페이지 제목 */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Title level={2} style={{ color: '#262626', marginBottom: '8px' }}>
              새 메모 작성
            </Title>
            <Text style={{ color: '#8c8c8c' }}>
              메모를 작성하고 AI에게 설명을 요청해보세요
            </Text>
          </div>

          {/* 메모 제목 */}
          <div style={{ marginBottom: '12px' }}>
            <Text style={{ fontSize: '18px', fontWeight: 600, color: '#262626' }}>
              메모 제목
            </Text>
          </div>
          <Form.Item 
            name="title" 
            rules={[{ required: true, message: '제목을 입력해주세요' }]}
            style={{ marginBottom: '32px' }}
          >
            <Input
              placeholder="제목을 입력하세요"
              size="large"
              style={{
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#ffffff',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                padding: '12px 16px',
                fontSize: '16px',
              }}
            />
          </Form.Item>

          {/* 카테고리 */}
          <div style={{ marginBottom: '12px' }}>
            <Text style={{ fontSize: '18px', fontWeight: 600, color: '#262626' }}>
              카테고리
            </Text>
          </div>
          <Form.Item 
            name="category"
            rules={[{ required: true, message: '카테고리를 선택해주세요' }]}
            style={{ marginBottom: '32px' }}
          >
            <Select
              placeholder="카테고리를 선택하세요"
              size="large"
              style={{ 
                borderRadius: '8px',
              }}
            >
              <Option value="수업노트">📚 수업노트</Option>
              <Option value="개발노트">💻 개발노트</Option>
              <Option value="어학공부">🌍 어학공부</Option>
              <Option value="아이디어">💡 아이디어</Option>
              <Option value="일기">📝 일기</Option>
              <Option value="독서노트">📖 독서노트</Option>
              <Option value="기타">🔖 기타</Option>
            </Select>
          </Form.Item>

          {/* 메모 내용 */}
          <div style={{ marginBottom: '12px' }}>
            <Text style={{ fontSize: '18px', fontWeight: 600, color: '#262626' }}>
              메모 내용
            </Text>
          </div>
          <Form.Item 
            name="content"
            rules={[{ required: true, message: '내용을 입력해주세요' }]}
            style={{ marginBottom: '32px' }}
          >
            <TextArea
              rows={8}
              placeholder="메모 내용을 입력하세요..."
              style={{
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#ffffff',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                fontSize: '16px',
                resize: 'none',
              }}
            />
          </Form.Item>

          {/* 버튼들 */}
          <Row gutter={12}>
            <Col span={12}>
              <Button
                block
                size="large"
                icon={<PlusCircleOutlined />}
                loading={loading}
                onClick={() => form.validateFields().then(handleSaveMemo)}
                style={{
                  borderColor: '#d9d9d9',
                  borderRadius: '25px',
                  height: '50px',
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#595959',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                저장만
              </Button>
            </Col>
            <Col span={12}>
              <Button
                type="primary"
                block
                size="large"
                icon={<RobotOutlined />}
                loading={aiLoading}
                onClick={() => form.validateFields().then(handleAIExplanation)}
                style={{
                  backgroundColor: '#52c41a',
                  borderColor: '#52c41a',
                  borderRadius: '25px',
                  height: '50px',
                  fontSize: '16px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {aiLoading ? 'AI 분석 중...' : 'AI 설명'}
              </Button>
            </Col>
          </Row>

          {/* AI 설명 중일 때 추가 안내 */}
          {aiLoading && (
            <div style={{ 
              textAlign: 'center', 
              marginTop: '20px',
              padding: '16px',
              backgroundColor: '#f6ffed',
              borderRadius: '8px',
              border: '1px solid #b7eb8f'
            }}>
              <Spin size="small" style={{ marginRight: '8px' }} />
              <Text style={{ color: '#52c41a' }}>
                AI가 메모를 분석하고 설명을 생성하고 있습니다...
              </Text>
            </div>
          )}
        </Form>
      </Content>

      <BottomNavBar />
    </Layout>
  );
};

export default MemoCreatePage; 