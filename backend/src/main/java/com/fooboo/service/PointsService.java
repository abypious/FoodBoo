package com.fooboo.service;

import com.fooboo.model.*;
import com.fooboo.repository.*;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PointsService {

    private final PointsHistoryRepository pointsRepo;
    private final UserRepository userRepo;

    public PointsService(PointsHistoryRepository pointsRepo, UserRepository userRepo) {
        this.pointsRepo = pointsRepo;
        this.userRepo = userRepo;
    }

    public void addPoints(User user, int change, String desc) {
        user.setTotalPoints(user.getTotalPoints() + change);
        userRepo.save(user);

        PointsHistory history = new PointsHistory();
        history.setUser(user);
        history.setChangeAmount(change);
        history.setDescription(desc);
        pointsRepo.save(history);
    }

    public List<PointsHistory> getHistory(User user) {
        return pointsRepo.findByUser(user);
    }
}
