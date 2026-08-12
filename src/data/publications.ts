import type { Publication } from "./types";

export const publications: Publication[] = [
  {
    id: "xiang-2025-physical-ai-survey",
    title:
      "Aligning Perception, Reasoning, Modeling and Interaction: A Survey on Physical AI",
    authors: [
      "Kun Xiang",
      "Terry Jingchen Zhang",
      "Yinya Huang",
      "Jixi He",
      "Zirong Liu",
      "Yueling Tang",
      "Ruizhe Zhou",
      "Lijing Luo",
      "Youpeng Wen",
      "Xiuwei Chen",
      "Bingqian Lin",
      "Jianhua Han",
      "Hang Xu",
      "Hanhui Li",
      "Bin Dong",
      "Xiaodan Liang",
    ],
    year: 2025,
    publicationType: "Survey",
    venue: "arXiv",
    category: "physical-ai",
    arxivId: "2510.04978",
    tldr:
      "A survey that organizes Physical AI around the alignment of perception, reasoning, modeling, and interaction.",
    links: {
      paper: "https://arxiv.org/abs/2510.04978",
      project: "https://github.com/AI4Phys/Awesome-AI-for-Physics",
    },
  },
  {
    id: "zhang-2025-physics-physical-reasoning",
    title:
      "Position: The Physics-Physical Reasoning Interplay is Key for Future Embodied World Models",
    authors: [
      "Terry Jingchen Zhang",
      "Kun Xiang",
      "Yinya Huang",
      "Jixi He",
      "Zirong Liu",
      "Yueling Tang",
      "Ruizhe Zhou",
      "Chengyu Yu",
      "Xiaodan Liang",
    ],
    year: 2025,
    publicationType: "Position paper",
    venue: "NeurIPS LAW Workshop",
    category: "world-models",
    tldr:
      "A position paper arguing that embodied world models should connect knowledge of physics with reasoning about physical situations.",
    links: {
      paper: "https://openreview.net/forum?id=XF7kHMLdWX",
    },
  },
  {
    id: "wang-2024-llm-detector",
    title:
      "LLM-Detector: Improving AI-Generated Chinese Text Detection with Open-Source LLM Instruction Tuning",
    authors: [
      "Rongsheng Wang",
      "Haoming Chen",
      "Ruizhe Zhou",
      "Han Ma",
      "Yaofei Duan",
      "Yanlan Kang",
      "Songhua Yang",
      "Baoyu Fan",
      "Tao Tan",
    ],
    year: 2024,
    publicationType: "Preprint",
    venue: "arXiv",
    category: "text-detection",
    tldr:
      "An instruction-tuning approach that improves detection of AI-generated Chinese text with open-source language models.",
    links: {
      paper: "https://arxiv.org/abs/2402.01158",
      code: "https://github.com/QiYuan-tech/LLM-Detector",
    },
  },
];
