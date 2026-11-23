# 따라잡기 파일

실습 중 한 단계가 막혔을 때, 해당 파일을 작업 폴더로 복사하면 다음 단계부터 이어 갈 수 있습니다. Claude 에게 이렇게 말해도 됩니다.

```
examples/checkpoints 에서 Define 단계까지 따라잡기 파일을 복사해줘
```

| 막힌 단계 | 복사할 파일 | 붙여 넣을 곳 |
|---|---|---|
| Discover | `01_discover/insights.md`, `01_discover/my-criteria.md` | `01_discover/` |
| Define | `02_define/brief.md` | `02_define/` |
| Develop (1차 화면) | `examples/before/*.html` | `03_develop/screens/` |
| 채점표 | `04_deliver/rubric.md` | `04_deliver/` |

아래는 강사가 같은 과제로 끝까지 돌린 기록입니다. 리포트가 어떻게 생겼는지 참고하세요.

| 파일 | 내용 |
|---|---|
| `04_deliver/review-loop0.md` | 1차 화면 채점 (48점, 반려) |
| `04_deliver/qa-loop0.md` | 1차 화면 QA (P1 누락 3건) |
| `04_deliver/review-loop3.md` | 루프 3 채점 (96점, 통과) |
| `04_deliver/log.md` | 48 → 69 → 87 → 96 기록 |
| `04_deliver_measure-loop0.md` | 1차 화면 기계 측정 원본 |

완성 화면은 `examples/after/` 에 있습니다.
