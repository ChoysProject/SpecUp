package com.spec.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Service
public class SequenceGeneratorService {
    @Autowired
    private MongoTemplate mongoTemplate;

    public String generateUserId() {
        Query query = new Query(Criteria.where("_id").is("userId"));
        Update update = new Update().inc("seq", 1);
        FindAndModifyOptions options = new FindAndModifyOptions().returnNew(true).upsert(true);
        Counter counter = mongoTemplate.findAndModify(query, update, options, Counter.class, "counters");
        return "U-" + counter.getSeq();
    }

    @Data
    @Document(collection = "counters")
    public static class Counter {
        @Id
        private String id;
        private long seq;
    }
} 