# 형호
from django.db.models import Q
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import question_board
from .serializers import QuestionCreateSerializer, QuestionListSerializer, QuestionDetailSerializer, \
    QuestionUpdateSerializer


class QuestionView(APIView):
    def get(self, request, id):
        # 질문에 대한 정보를 필터링 하기위한 파라미터
        # 질문에 관한 데이터만 가져온다
        question = question_board.objects.get(id=id)
        # 질문에 대한 데이터 의 직렬화
        question_serializer = QuestionDetailSerializer(question)

        return Response(data=question_serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = QuestionCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.create(validated_data=serializer.validated_data)
            return Response(data={'state':"게시글이 정상적으로 작성되었습니다."},
                            status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, id):
        question = question_board.objects.get(id=id)  # user , title , body , state create
        serializer = QuestionUpdateSerializer(question, data=request.data)

        if serializer.is_valid():
            serializer.update(question, serializer.validated_data)
            return Response(data={"state":"게시글이 정상적으로 수정되었습니다"},status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        user = question_board.objects.get(id=id)
        user.delete()
        return Response(data={"state":"게시글이 정상적으로 삭제 되었습니다."},status=status.HTTP_204_NO_CONTENT)



class QuestionListView(APIView):
    def get(self, request , id):
        queryset = question_board.objects.filter(user=id)
        serializer = QuestionListSerializer(queryset, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)
