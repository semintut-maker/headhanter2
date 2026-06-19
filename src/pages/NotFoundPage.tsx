/** @format */

import { Container, Title, Text, Button, Stack } from "@mantine/core";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <Container
      size='md'
      py={80}>
      <Stack
        align='center'
        gap='md'>
        {/* Грустная картинка */}
        <img
          src={`${import.meta.env.BASE_URL}sad.jpg`}
          alt='Страница не найдена'
          style={{
            width: "300px",
            height: "150px",
          }}
        />

        {/* 404 */}
        <Title
          order={1}
          style={{
            fontSize: "72px",
            fontWeight: 700,
            color: "#dee2e6",
            lineHeight: 1,
            marginTop: "8px",
          }}>
          404
        </Title>

        {/* Упс! Такой страницы не существует */}
        <Title
          order={2}
          style={{
            fontSize: "28px",
            fontWeight: 600,
            color: "#1a1a1a",
            marginTop: "4px",
          }}>
          Упс! Такой страницы не существует
        </Title>

        {/* Давайте перейдём к началу */}
        <Text
          size='md'
          c='dimmed'
          style={{
            fontSize: "16px",
            color: "#868e96",
          }}>
          Давайте перейдём к началу.
        </Text>

        {/* Кнопка На главную */}
        <Button
          component={Link}
          to='/vacancies/moscow'
          size='md'
          radius='md'
          mt='md'
          style={{
            backgroundColor: "#0d0dd0",
            color: "#FFFFFF",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#0d0dd0";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#0d0dd0";
          }}>
          На главную
        </Button>
      </Stack>
    </Container>
  );
}
