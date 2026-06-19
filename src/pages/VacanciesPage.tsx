/** @format */

import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  Container,
  Grid,
  Paper,
  Title,
  Space,
  Box,
  TextInput,
  Button,
  Group,
  Flex,
  Tabs,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import type { RootState, AppDispatch } from "../store/store";
import {
  fetchVacanciesStart,
  fetchVacanciesSuccess,
  fetchVacanciesFailure,
} from "../store/slices/vacanciesSlice";
import { setCurrentPage, setTotalPages } from "../store/slices/paginationSlice";
import { setSearch, setSkills } from "../store/slices/filtersSlice";
import { fetchJobs } from "../api/jobsApi";
import SkillsInput from "../components/SkillsInput";
import VacanciesList from "../components/VacanciesList";
import PaginationComponent from "../components/PaginationComponent";
import { useDebounce } from "../hooks/useDebounce";
import { useMantineTheme } from "@mantine/core";

export default function VacanciesPage() {
  const theme = useMantineTheme();
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab =
    location.pathname.includes("moscow") ? "moscow" : "petersburg";
  const city = activeTab === "moscow" ? "Москва" : "Санкт-Петербург";

  const filters = useSelector((state: RootState) => state.filters);
  const { currentPage, itemsPerPage } = useSelector(
    (state: RootState) => state.pagination,
  );

  const [localSearch, setLocalSearch] = useState(filters.search);
  const debouncedSearch = useDebounce(localSearch, 500);
  const isFirstRender = useRef(true);

  // Чтение параметров из URL при первом рендере
  useEffect(() => {
    if (isFirstRender.current) {
      const search = searchParams.get("search") || "";
      const skillsParam = searchParams.get("skills") || "";
      const skills = skillsParam ? skillsParam.split(",") : [];
      dispatch(setSearch(search));
      dispatch(setSkills(skills));
      setLocalSearch(search);
      isFirstRender.current = false;
    }
  }, [searchParams, dispatch]);

  // Синхронизация фильтров с URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.skills.length) params.set("skills", filters.skills.join(","));
    setSearchParams(params, { replace: true });
  }, [filters.search, filters.skills, setSearchParams]);

  // Debounce
  useEffect(() => {
    dispatch(setSearch(debouncedSearch));
  }, [debouncedSearch, dispatch]);

  // Сброс страницы при изменении фильтров
  useEffect(() => {
    dispatch(setCurrentPage(1));
  }, [filters.search, filters.skills, dispatch]);

  // Загрузка вакансий
  useEffect(() => {
    const loadVacancies = async () => {
      dispatch(fetchVacanciesStart());
      try {
        const { items, total } = await fetchJobs({
          search: filters.search,
          city: city,
          skills: filters.skills,
          page: currentPage,
          limit: itemsPerPage,
        });
        dispatch(fetchVacanciesSuccess(items));
        const totalPages = Math.ceil(total / itemsPerPage);
        dispatch(setTotalPages(totalPages));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Ошибка загрузки";
        dispatch(fetchVacanciesFailure(errorMessage));
      }
    };
    loadVacancies();
  }, [
    filters.search,
    filters.skills,
    currentPage,
    itemsPerPage,
    city,
    dispatch,
  ]);

  const handleSearchClick = () => {
    dispatch(setSearch(localSearch));
    dispatch(setCurrentPage(1));
  };

  const handleTabChange = (value: string | null) => {
    if (value) {
      navigate(`/vacancies/${value}`);
    }
  };

  return (
    <Box
      style={{
        backgroundColor: theme.other?.background || "#FFFFFF",
        minHeight: "100vh",
        paddingTop: "32px",
        paddingBottom: "32px",
      }}>
      <Container size='xl'>
        <Flex
          justify='space-between'
          align='flex-start'
          wrap='wrap'
          gap='md'
          mb='lg'>
          <Box style={{ maxWidth: "500px" }}>
            <Title
              order={1}
              style={{
                fontSize: "28px",
                fontWeight: 700,
                color: theme.other?.black1 || "#0F0F10",
                margin: 0,
                lineHeight: 1.2,
              }}>
              Список вакансий
            </Title>
            <Title
              order={2}
              style={{
                fontSize: "20px",
                fontWeight: 400,
                color: theme.other?.gray || "rgba(15,15,16,0.5)",
                margin: 0,
                marginTop: "4px",
              }}>
              по профессии Frontend-разработчик
            </Title>
          </Box>

          <Group
            align='flex-end'
            gap='sm'
            style={{ flex: 1, justifyContent: "flex-end" }}>
            <TextInput
              placeholder='Должность или название компании'
              leftSection={<IconSearch size={16} />}
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              style={{ width: "100%", maxWidth: 480 }}
            />
            <Button
              onClick={handleSearchClick}
              radius='md'
              style={{
                backgroundColor: theme.other?.primary || "#364FC7",
                color: theme.white,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  theme.other?.darkPrimary || "#2b3fa0";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  theme.other?.primary || "#364FC7";
              }}>
              Найти
            </Button>
          </Group>
        </Flex>

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          mb='lg'>
          <Tabs.List>
            <Tabs.Tab value='moscow'>Москва</Tabs.Tab>
            <Tabs.Tab value='petersburg'>Санкт-Петербург</Tabs.Tab>
          </Tabs.List>
        </Tabs>

        <Grid gutter='xl'>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Paper
              shadow='none'
              p='md'
              radius='md'
              style={{ backgroundColor: theme.white }}>
              <Title
                order={3}
                size='h4'
                mb='md'
                style={{ fontWeight: 600 }}>
                Ключевые навыки
              </Title>
              <SkillsInput />
            </Paper>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 9 }}>
            <VacanciesList />
            <Space h='xl' />
            <PaginationComponent />
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
}
