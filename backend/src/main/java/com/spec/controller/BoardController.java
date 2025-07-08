package com.spec.controller;

import com.spec.domain.Board;
import com.spec.service.BoardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/boards")
@CrossOrigin(origins = "*")
public class BoardController {
    @Autowired
    private BoardService boardService;

    @PostMapping
    public Board createBoard(@RequestBody Board board) {
        return boardService.saveBoard(board);
    }

    @GetMapping
    public List<Board> getBoards(@RequestParam(defaultValue = "0") int page,
                               @RequestParam(defaultValue = "7") int size) {
        return boardService.getBoards(page, size);
    }

    @GetMapping("/{id}")
    public Optional<Board> getBoardById(@PathVariable String id) {
        return boardService.getBoardById(id);
    }

    @GetMapping("/count")
    public long countBoards() {
        return boardService.countBoards();
    }
} 