// 필요한 모듈 및 컴포넌트 가져오기
"use client";
import { useMutation, useQuery } from "convex/react";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Toolbar } from "@/components/toolbar";
import { Cover } from "@/components/cover";
import { Skeleton } from "@/components/ui/Skeleton";

// 페이지에서 사용할 props 정의
interface DocumentIdPageProps {
  params: {
    documentId: Id<"documents">;
  };
}

// 페이지 컴포넌트 정의
const DocumentIdPage = ({ params }: DocumentIdPageProps) => {
  // 동적으로 불러오는 Editor 컴포넌트
  const Editor = useMemo(
    () => dynamic(() => import("@/components/editor"), { ssr: false }),
    []
  );

  // 문서에 대한 쿼리 수행
  const document = useQuery(api.documents.getById, {
    documentId: params.documentId,
  });

  // 문서 업데이트에 사용되는 뮤테이션
  const update = useMutation(api.documents.update);

  // 에디터 내용이 변경될 때 호출되는 콜백 함수
  const onChange = (content: string) => {
    update({
      id: params.documentId,
      content,
    });
  };

  // 문서가 로딩 중인 경우
  if (document === undefined) {
    return (
      <div>
        <Cover.Skeleton />
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>
    );
  }

  // 문서를 찾지 못한 경우
  if (document === null) {
    return <div>Not found</div>;
  }

  // 문서 페이지 렌더링
  return (
    <div className="pb-40">
      <Cover url={document.coverImage} />
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        <Toolbar initialData={document} />
        <Editor onChange={onChange} initialContent={document.content} />
      </div>
    </div>
  );
};

export default DocumentIdPage;
