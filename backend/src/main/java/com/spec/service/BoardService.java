package com.spec.service;

import com.spec.domain.Board;
import com.spec.repository.BoardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BoardService {
    @Autowired
    private BoardRepository boardRepository;

    public Board saveBoard(Board board) {
        return boardRepository.save(board);
    }

    public List<Board> getBoards(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return boardRepository.findAll(pageable).getContent();
    }

    public Optional<Board> getBoardById(String id) {
        return boardRepository.findById(id);
    }

    public long countBoards() {
        return boardRepository.count();
    }
} 